using Database;
using Mail;
using Microsoft.EntityFrameworkCore;

namespace Routes;

public static class ProfileRoutesExtension
{
    public static RouteGroupBuilder MapProfileRoutes(this RouteGroupBuilder app)
    {
        app.MapGroup("/profile").MapGet("/", (Db db) =>
        {
            Results.Ok("Profile Route!!!");
        });
        return app;
    }
}