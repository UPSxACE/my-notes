using System.Security.Claims;
using Database;
using Dependencies;
using FluentValidation;
using HotChocolate.Authorization;
using UuidExtensions;

namespace Graphql;

[ExtendObjectType(typeof(Mutation))]
public class FolderMutations()
{

    [Authorize(Policy = "user")]
    // Remove ?
    public async Task<Folder?> CreateFolder([Service] Services services, [Service] UserContext userContext, CreateFolderInput createFolderInput)
    {
        // validate
        var validator = new CreateFolderInputValidator();
        var result = validator.Validate(createFolderInput);
        if (!result.IsValid) throw new GraphQLException(result.Errors[0].ErrorMessage);

        // remove trailing slash
        var range = createFolderInput.Path.Length - 1;
        if (range > 0 && createFolderInput.Path.EndsWith('/')) createFolderInput.Path = createFolderInput.Path[..range];

        // get user and check conflict
        var user = await services.ExistingUser(x => x.ID == userContext.GetUserId()) ?? throw new GraphQLException("User not found");
        var existingFolder = await services.ExistingFolder(x => x.UserId == user.ID && x.Path == createFolderInput.Path);
        if (existingFolder != null) throw new GraphQLException("Folder already exists");

        var newFolder = await services.CreateFolder(user.ID, createFolderInput.Path, createFolderInput.Priority);
        if (newFolder == null) throw new GraphQLException("Unexpected error creating folder");

        var notes = await services.ExistingNotes(x => x.FolderId == newFolder.Id);
        var foldersInside = await services.FoldersInPath(user.ID, newFolder.Path);
        var nodesCount = notes.Count + foldersInside.Count;

        return newFolder.ToDto(nodesCount, notes.LastOrDefault()?.CreatedAt ?? null);
    }

    [Authorize(Policy = "user")]
    public async Task<Folder> MoveFolder([Service] Services services, [Service] UserContext userContext, MoveFolderInput moveFolderInput)
    {
        var userId = userContext.GetUserId();
        // find folders
        var currentFolder = await services.ExistingFolder(x => x.UserId == userId && x.Path == moveFolderInput.CurrentPath) ?? throw new GraphQLException("Current folder not found");
        var targetFolder = await services.ExistingFolder(x => x.UserId == userId && x.Path == moveFolderInput.TargetPath) ?? throw new GraphQLException("Target folder not found");

        var oldPath = currentFolder.Path;
        var targetPath = targetFolder.Path;
        var newPath = targetFolder.Path + "/" + services.GetFolderName(currentFolder.Path);

        // move folders
        var foldersInside = await services.FoldersInPathRecursive(userId ?? 0, oldPath);
        currentFolder.Path = newPath;
        foldersInside.ForEach(x => x.Path = x.Path.Replace(oldPath, newPath));

        await services.SaveChanges();

        var notesList = await services.ExistingNotes(x => x.FolderId == currentFolder.Id && x.Deleted != true);
        var foldersInsideNonRecursive = await services.FoldersInPath(userId ?? 0, currentFolder.Path);
        var nodesCount = notesList.Count + foldersInsideNonRecursive.Count;

        return currentFolder.ToDto(nodesCount, notesList.LastOrDefault()?.CreatedAt ?? null);
    }

    [Authorize(Policy = "user")]
    public async Task<Note> MoveNote([Service] Services services, [Service] UserContext userContext, MoveNoteInput moveNoteInput)
    {
        // find folders
        var note = await services.ExistingNote(x => x.UserId == userContext.GetUserId() && x.Id == moveNoteInput.NoteId && x.Deleted != true) ?? throw new GraphQLException("Note not found");
        var targetFolder = await services.ExistingFolder(x => x.UserId == userContext.GetUserId() && x.Path == moveNoteInput.TargetPath) ?? throw new GraphQLException("Target folder not found");

        // move note
        note.Folder = targetFolder;

        await services.SaveChanges();

        return note.ToDto();
    }
}

public record struct CreateFolderInput(string Path, int Priority);

public class CreateFolderInputValidator : AbstractValidator<CreateFolderInput>
{
    public CreateFolderInputValidator()
    {
        RuleFor(x => x.Priority).GreaterThanOrEqualTo(0).WithMessage("Please choose an integer greater than or equal to 0.");
        RuleFor(x => x.Path).MaximumLength(511).WithMessage("Path is too long.");
        RuleFor(x => x.Path).Must(x =>
        {
            if (x.Equals("/")) return false;
            if (!x.StartsWith('/')) return false;
            if (x.Contains("//")) return false;
            if (x.Contains('\\')) return false;
            if (x.Contains('.')) return false;
            return true;
        }).WithMessage("Please choose a valid path.");
        RuleFor(x => x.Path).Must(x =>
        {
            var range = x.Length - 1;
            if (range < 0) return true;

            var xTrimmed = x.EndsWith('/') ? x[..range] : x;
            return xTrimmed.Count(x => x == '/') < 6;
        }).WithMessage("Reached limit of folder nesting.");
    }
}


public record struct MoveFolderInput(string CurrentPath, string TargetPath);
public record struct MoveNoteInput(string NoteId, string TargetPath);

