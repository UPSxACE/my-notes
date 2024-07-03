using SignalRChat.Hubs;

namespace Extensions;

public static class AppGlobalMiddlewaresExtension
{
    public static WebApplication UseGlobalMiddlewares(this WebApplication app)
    {
        // Cors
        app.UseCors("_corsPolicy");

        // Graphql
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapGraphQL();

        // SignalR Hubs
        app.MapHub<TestHub>("/hubs/test");

        if (app.Environment.IsDevelopment())
        {
            // NOTE: Development only

            // Swagger
            app.UseSwagger();
            app.UseSwaggerUI(
                c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyNotes Api V1")
            );

            app.UseDeveloperExceptionPage(); // Captures synchronous and asynchronous Exception instances from the pipeline
                                             // and generates HTML error responses.
            app.UseMigrationsEndPoint();
            // app.UseHttpsRedirection();

            return app;
        }

        // NOTE: Production only

        app.UseExceptionHandler("/error"); // Adds a middleware to the pipeline that will catch exceptions, log them,
                                           // reset the request path, and re-execute the request.
                                           // The request will not be re-executed if the response has already started.
        app.UseHsts(); // Adds middleware for using HSTS, which adds the Strict-Transport-Security header.

        return app;
    }
}
