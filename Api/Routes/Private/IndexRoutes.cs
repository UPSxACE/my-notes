namespace Routes;

public static class IndexRoutesExtension {
    public static RouteGroupBuilder MapIndexRoutes(this RouteGroupBuilder  app){
        app.MapGet("/", () => Results.Ok("Hello World!!!"));
        return app;
    }
}