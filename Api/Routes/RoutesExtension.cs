namespace Routes;

public static class RoutesExtension
{
    public static WebApplication MapRoutes(this WebApplication app)
    {
        // Public Routes
        app.MapGroup("/")
            .MapIndexRoutes()
            .MapAuthRoutes()
            .AddEndpointFilter(async (context, next) =>
            {
                return await next(context);
            });

        // Private Routes
        app.MapGroup("/")
            .MapProfileRoutes()
            .AddEndpointFilter(async (context, next) =>
            {
                return await next(context);
            }).RequireAuthorization("user");

        return app;
    }
}