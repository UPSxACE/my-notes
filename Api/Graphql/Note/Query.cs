using System.Linq.Expressions;
using System.Text.Json;
using Database;
using Dependencies;
using FluentValidation.Validators;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;
using Utils;

namespace Graphql;

[ExtendObjectType(typeof(Query))]
public class NoteQueries
{
    private const int DEFAULT_PAGE_SIZE = 16;
    private const int MAX_PAGE_SIZE = 20;
    public async Task<CursorSearch<List<Note>>> SearchNote([Service] Db db, [Service] Services services, [Service] UserContext userContext, SearchInput searchInput)
    {
        // TODO: Create search wildcards, like path:"/"
        // TODO: Create a new order type: relevance

        int pageSize = Math.Max(0, Math.Min(MAX_PAGE_SIZE, searchInput.PageSize ?? DEFAULT_PAGE_SIZE));

        string orderBy = "createdat";
        string? obInput = searchInput?.OrderBy?.ToLower();
        if (obInput == "title" || obInput == "priority" || obInput == "views")
            orderBy = obInput;

        string direction = searchInput?.Direction switch
        {
            "asc" or "desc" => searchInput.Direction,
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
                                              //  ? db.Notes.OrderBy(x => x.SearchVector!.Rank(EF.Functions.PlainToTsQuery(searchInput.Query)))
                                              ? db.Notes.OrderBy(keySelector).ThenBy(x => x.Id)
                                             : db.Notes.OrderByDescending(keySelector).ThenByDescending(x => x.Id);


        var query = searchInput?.Query ?? "";
        // var filteredNotes = orderedNotes.Where(x => x.UserId == userContext.GetUserId()
        //                                        && EF.Functions.TrigramsAreSimilar(x.Title.ToLower() ?? "", query.ToLower())
        //                                        || EF.Functions.TrigramsAreSimilar((x.ContentText ?? "").ToLower(), query.ToLower())
        //                                  );
        // basic filter
        var filteredNotes = orderedNotes.Include(x => x.Folder)
                                        .Include(x => x.NoteTags!).ThenInclude(x => x.NoteTag)
                                        .Where(x => x.UserId == userContext.GetUserId()
                                                    && x.SearchVector!.Matches(query));



        string? newCursor = null;
        List<NoteModel> notes = [];
        if (orderBy == "title")
        {
            DecodedSearchCursor<string, string>? cursor;
            cursor = SearchCursorEncoder.DecodeCursor<string, string>(searchInput?.Cursor);
            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.Title.CompareTo(cursor.Cursor1) >= 0 && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.Title.CompareTo(cursor.Cursor1) <= 0 && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(pageSize + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorEncoder.EncodeCursor(notes[pageSize].Title, notes[pageSize].Id);
        }

        if (orderBy == "priority")
        {
            DecodedSearchCursor<int, string>? cursor;
            cursor = SearchCursorEncoder.DecodeCursor<int, string>(searchInput?.Cursor);
            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.Priority >= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.Priority <= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(pageSize + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorEncoder.EncodeCursor(notes[pageSize].Priority, notes[pageSize].Id);
        }

        if (orderBy == "views")
        {
            DecodedSearchCursor<int, string>? cursor;
            cursor = SearchCursorEncoder.DecodeCursor<int, string>(searchInput?.Cursor);
            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.Views >= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.Views <= cursor.Cursor1 && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(pageSize + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorEncoder.EncodeCursor(notes[pageSize].Views, notes[pageSize].Id);
        }

        if (orderBy == "createdat")
        {
            DecodedSearchCursor<long, string>? cursor;
            cursor = SearchCursorEncoder.DecodeCursor<long, string>(searchInput?.Cursor);
            DateTime? cursorTime = cursor != null ? new DateTime(cursor.Cursor1).ToUniversalTime() : null;

            if (cursor != null && direction == "asc")
                filteredNotes = filteredNotes.Where(x => x.CreatedAt >= cursorTime && x.Id.CompareTo(cursor.Cursor2) >= 0);
            if (cursor != null && direction == "desc")
                filteredNotes = filteredNotes.Where(x => x.CreatedAt <= cursorTime && x.Id.CompareTo(cursor.Cursor2) <= 0);
            notes = await filteredNotes.Take(pageSize + 1).ToListAsync();
            if (notes.Count == pageSize + 1)
                newCursor = SearchCursorEncoder.EncodeCursor(notes[pageSize].CreatedAt?.Ticks ?? DateTime.MinValue.Ticks, notes[pageSize].Id);
        }

        List<Note> notesList = [];
        foreach (var x in notes[..Math.Min(pageSize, notes.Count)]) notesList.Add(x.ToDto());

        return new CursorSearch<List<Note>>(notesList, newCursor);
    }
}

public record SearchInput(string Query, string? Cursor, string? OrderBy, string? Direction, int? PageSize);