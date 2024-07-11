using Database;
using Dependencies;

namespace Routes;

public static class NoteRoutesExtension
{
    public static RouteGroupBuilder MapNoteRoutes(this RouteGroupBuilder app)
    {
        app.MapGroup("/notes").MapGet("/{noteId}", async (string noteId, Services services, UserContext user) =>
        {
            var note = await services.ExistingNote(x => x.UserId == user.GetUserId() && x.Id == noteId && x.Deleted == false, true, true);
            if (note == null) return Results.NotFound();
            return Results.Ok(note.ToDto());
        });
        return app;
    }
}