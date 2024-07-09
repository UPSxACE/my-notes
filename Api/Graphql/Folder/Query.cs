using System.Linq.Expressions;
using Api.Migrations;
using Database;
using Dependencies;
using FluentValidation;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Utils;

namespace Graphql;

[ExtendObjectType(typeof(Query))]
public class FolderQueries
{
    private const int DEFAULT_PAGE_SIZE = 16;
    private const int MAX_PAGE_SIZE = 20;

    [Authorize(Policy = "user")]
    public async Task<List<Folder>> OwnFolders([Service] Services services, [Service] UserContext userContext)
    {
        var userId = userContext.GetUserId() ?? throw new GraphQLException("Invalid authentication");
        var folders = await services.ExistingFolders(x => x.UserId == userId);

        return folders.Select(x => x.ToDto()).ToList();
    }

    [Authorize(Policy = "user")]
    public async Task<List<FolderModel>> FoldersInPath([Service] Services services, [Service] UserContext userContext, string path = "/")
    {
        var userId = userContext.GetUserId() ?? throw new GraphQLException("Invalid authentication");
        var folders = await services.FoldersInPath(userId, path);

        return folders;
    }

    [Authorize(Policy = "user")]
    public async Task<PathNodes> Navigate([Service] Db db, [Service] Services services, [Service] UserContext userContext, NavigateInput input)
    {
        var userId = userContext.GetUserId() ?? throw new GraphQLException("Invalid authentication");

        // validate
        var validator = new NavigateInputValidator();
        var result = validator.Validate(input);
        if (!result.IsValid) throw new GraphQLException(result.Errors[0].ErrorMessage);

        // fetch folders
        var folders = await services.FoldersInPath(userId, input.Path);

        int pageSize = Math.Max(0, Math.Min(MAX_PAGE_SIZE, input.PageSize ?? DEFAULT_PAGE_SIZE));
        double folderPerPage = folders.Count / pageSize;
        double totalFolderPages = Math.Ceiling(folderPerPage);
        int currentPage = 1; // implicit minimum 1 here

        DecodedSearchCursorPaged<object?, string?>? rawCursor;
        rawCursor = SearchCursorPagedEncoder.DecodeCursor<object?, string?>(input?.Cursor);
        if (rawCursor != null) currentPage = Math.Max(Math.Min(rawCursor.Page, MAX_PAGE_SIZE), 1);

        var pagesAlreadySeen = currentPage - 1; // implicit minimum 0 here
        var foldersAlreadySeen = Math.Min(pagesAlreadySeen * pageSize, folders.Count);
        var foldersLeft = folders.Count - foldersAlreadySeen;

        var foldersToFetch = Math.Max(Math.Min(foldersLeft, pageSize), 0);
        var maxNotesToFetch = Math.Max(Math.Min(pageSize - foldersToFetch, pageSize), 0);

        var rangeStart = foldersAlreadySeen;
        var rangeEnd = foldersAlreadySeen + foldersToFetch;
        List<FolderModel> currentPageFolders = foldersToFetch > 0 ? folders[rangeStart..rangeEnd] : [];

        // NOTE: if only folders, still need to fetch at least one note for cursor (if there is any)

        // now fetch notes
        string orderBy = "createdat";
        string? obInput = input?.OrderBy?.ToLower();
        if (obInput == "title" || obInput == "priority" || obInput == "views")
            orderBy = obInput;

        string direction = input?.Direction switch
        {
            "asc" or "desc" => input.Direction,
            // defaults
            _ => orderBy switch
            {
                "title" or "createdat" => "asc",
                _ => "desc",
            }
        };

        Expression<Func<NoteModel, object?>> keySelector = orderBy switch
        {
            "title" => (NoteModel x) => x.Title,
            "priority" => (NoteModel x) => x.Priority,
            "views" => (NoteModel x) => x.Views,
            _ => (NoteModel x) => x.CreatedAt,
        };

        var orderedNotes = direction == "asc"
                            ? db.Notes.OrderBy(keySelector).ThenBy(x => x.Id)
                            : db.Notes.OrderByDescending(keySelector).ThenByDescending(x => x.Id);

        // basic filter
        var path = input?.Path ?? "/";
        var filteredNotes = orderedNotes.Include(x => x.Folder)
                                        .Where(x => x.UserId == userContext.GetUserId() && x.Folder.Path == path);

        string? newCursor = null;
        List<NoteModel> notes = [];
        if (orderBy == "title")
        {
            DecodedSearchCursorPaged<string, string>? cursor;
            cursor = SearchCursorPagedEncoder.DecodeCursor<string, string>(input?.Cursor);
            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.Title.CompareTo(cursor.Cursor1) >= 0 && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.Title.CompareTo(cursor.Cursor1) <= 0 && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(maxNotesToFetch + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorPagedEncoder.EncodeCursor(notes[pageSize].Title, notes[pageSize].Id, currentPage + 1);
        }

        if (orderBy == "priority")
        {
            DecodedSearchCursorPaged<int, string>? cursor;
            cursor = SearchCursorPagedEncoder.DecodeCursor<int, string>(input?.Cursor);
            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.Priority >= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.Priority <= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(maxNotesToFetch + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorPagedEncoder.EncodeCursor(notes[pageSize].Priority, notes[pageSize].Id, currentPage + 1);
        }

        if (orderBy == "views")
        {
            DecodedSearchCursorPaged<int, string>? cursor;
            cursor = SearchCursorPagedEncoder.DecodeCursor<int, string>(input?.Cursor);
            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.Views >= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.Views <= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(maxNotesToFetch + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorPagedEncoder.EncodeCursor(notes[pageSize].Views, notes[pageSize].Id, currentPage + 1);
        }

        if (orderBy == "createdat")
        {
            DecodedSearchCursorPaged<long, string>? cursor;
            cursor = SearchCursorPagedEncoder.DecodeCursor<long, string>(input?.Cursor);
            DateTime? cursorTime = cursor != null ? new DateTime(cursor.Cursor1) : null;

            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.CreatedAt >= cursorTime && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.CreatedAt <= cursorTime && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(maxNotesToFetch + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorPagedEncoder.EncodeCursor(notes[pageSize].CreatedAt?.Ticks ?? DateTime.MinValue.Ticks, notes[pageSize].Id, currentPage + 1);
        }

        List<Note> notesList = [];
        foreach (var x in notes[..Math.Min(maxNotesToFetch, notes.Count)]) notesList.Add(await x.ToDto(services));

        var foldersLeftAfterFetch = foldersLeft - foldersToFetch;
        //if 0 notes, but still have folders left to fetch, create cursor with next page
        if (newCursor == null && foldersLeftAfterFetch > 0)
        {
            newCursor = SearchCursorPagedEncoder.EncodeCursor<object?, string?>(null, null, currentPage + 1);
        }

        List<Folder> folderList = currentPageFolders.Select(x => x.ToDto()).ToList();

        return new PathNodes
        (
            notesList,
            folderList,
            newCursor
        );
    }
}

public record NavigateInput(string? Cursor, string? OrderBy, string? Direction, int? PageSize, string Path = "/");
public class NavigateInputValidator : AbstractValidator<NavigateInput>
{
    public NavigateInputValidator()
    {
        RuleFor(x => x.Path).MaximumLength(511).WithMessage("Path is too long.");
        RuleFor(x => x.Path).Must(x =>
        {
            if (!x.StartsWith('/')) return false;
            if (x.Contains("//")) return false;
            return true;
        }).WithMessage("Please choose a valid path.");
        RuleFor(x => x.Path).Must(x =>
        {
            var range = x.Length - 1;
            if (range <= 0) return true;

            var xTrimmed = x.EndsWith('/') ? x[..range] : x;
            return xTrimmed.Count(x => x == '/') < 6;
        }).WithMessage("Reached limit of folder nesting.");
    }
}