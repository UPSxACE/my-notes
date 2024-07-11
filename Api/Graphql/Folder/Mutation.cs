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

        return newFolder.ToDto(notes.Count, notes.LastOrDefault()?.CreatedAt ?? null);
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