using System.Security.Claims;
using Database;
using Dependencies;
using FluentValidation;
using HotChocolate.Authorization;
using UuidExtensions;

namespace Graphql;

[ExtendObjectType(typeof(Mutation))]
public class NoteMutations
{

    [Authorize(Policy = "user")]
    public async Task<Note> CreateNote([Service] Services services, [Service] UserContext userContext, CreateNoteInput createNoteInput)
    {
        // validate
        var validator = new CreateNoteInputValidator();
        var result = validator.Validate(createNoteInput);
        if (!result.IsValid) throw new GraphQLException(result.Errors[0].ErrorMessage);

        var user = await services.ExistingUser(x => x.ID == userContext.GetUserId()) ?? throw new GraphQLException("User not found");
        var folder = await services.ExistingFolder(x => x.UserId == user.ID && x.Path == createNoteInput.FolderPath) ?? throw new GraphQLException("Folder not found");

        var uid = Uuid7.Id25();

        // add folders and tags
        var newNote = await services.CreateNote(user.ID, createNoteInput.FolderPath, createNoteInput.Tags, createNoteInput.Title, createNoteInput.Content, createNoteInput.ContentText, createNoteInput.Priority);

        if (newNote == null) throw new GraphQLException("Unexpected error creating note");

        return await newNote.ToDto(services);
    }
}

public record struct CreateNoteInput(string FolderPath, string Title, string Content, string ContentText, List<string> Tags, int Priority);

public class CreateNoteInputValidator : AbstractValidator<CreateNoteInput>
{
    public CreateNoteInputValidator()
    {
        RuleFor(x => x.Title)
            .MinimumLength(3)
            .WithMessage("Please choose a bigger title.")
            .MaximumLength(255)
            .WithMessage("Please choose a smaller title.");
        RuleFor(x => x.ContentText)
            .MaximumLength(32767)
            .WithMessage("The note is too big.");
        RuleFor(x => x.Content)
            .MaximumLength(131071)
            .WithMessage("The note is too big.");
        RuleFor(x => x.Tags).ForEach(
            x => x.MinimumLength(1)
                  .WithMessage("Tag names cannot be empty.")
                  .MaximumLength(31).WithMessage("At least one of the tag names is too big.")
            );
        RuleFor(x => x.Priority).GreaterThanOrEqualTo(0).WithMessage("Please choose an integer greater than or equal to 0.");
    }
}