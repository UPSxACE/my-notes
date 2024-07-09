using System.Text;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Mail;
using Dependencies;

namespace Extensions;

public static class BuilderServicesExtension
{

    public static IServiceCollection RegisterAuthServices(this IServiceCollection services, IConfiguration config, bool isProduction)
    {
        // JWT Authentication
        var jwt_key = Encoding.ASCII.GetBytes(config["JWT_SECRET"] ?? throw new Exception("JWT_SECRET Config Missing"));
        services.AddAuthentication(authOptions =>
        {
            authOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            authOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(bearerOptions =>
        {

            var cookieName = config["JWT_COOKIE_NAME"] ?? throw new Exception("JWT_COOKIE_NAME Config Missing");
            bearerOptions.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // Read from both cookie AND authorization header
                    string? cookie = context.Request.Cookies[cookieName];
                    string? header = context.Request.Headers["Authorization"]; // context.Request.GetTypedHeaders().Get<string>("Authorization");
                    string? tokenSource = null;
                    if (header != null && header.StartsWith("Bearer "))
                    {
                        tokenSource = "header";
                        header = header.Remove(0, 7); // Remove "Bearer "
                        context.Token = header;
                    }
                    if (cookie != null)
                    {
                        tokenSource = "cookie";
                        context.Token = cookie;
                    }

                    context.HttpContext.Items["tokenSource"] = tokenSource;
                    return Task.CompletedTask;
                },
                OnTokenValidated = context =>
                {
                    // If token is still valid but its less than 1 day before it expires,
                    // append a fresh token to the response cookies
                    // NOTE: In case the token is being sent by a Authorization header,
                    // the token will only be refreshed if the request contains a header X-Automatic-Refresh set to "true".
                    // In that case the response will send the new token in a header with the name X-Fresh-Token
                    var claims = context.Principal?.Claims.ToList();
                    string? tokenSource = context.Request.HttpContext.Items["tokenSource"] as string;
                    string? automaticRefreshHeader = context.Request.Headers["X-Automatic-Refresh"];
                    bool refreshableToken = tokenSource == "cookie" || tokenSource == "header" && automaticRefreshHeader == "true";
                    if (claims != null && refreshableToken)
                    {
                        // FIXME: In the future, tokens with "isDemo" set to "true" wont be renewed
                        var validUntil = context.SecurityToken.ValidTo;
                        var id = context.Principal?.FindFirst("userId");
                        var roles = context.Principal?.FindAll(ClaimTypes.Role).ToList();
                        var isDemo = context.Principal?.FindFirst("isDemo");
                        if (roles != null && id != null && isDemo != null)
                        {
                            var oneDayBefore = validUntil.AddDays(-1);
                            if (DateTime.UtcNow >= oneDayBefore)
                            {
                                Jwt.Token token = new(config);
                                string newToken = token.Create(id.Value, [.. roles.ConvertAll(claim => claim.Value)], isDemo.Value);


                                if (tokenSource == "cookie")
                                {
                                    context.Response.Cookies.Append(cookieName, newToken, token.GetJwtCookieOptions(isProduction));
                                }
                                if (tokenSource == "header")
                                {
                                    context.Response.Headers.Append("X-Fresh-Token", newToken);
                                }
                            };
                        }
                    }

                    return Task.CompletedTask;
                }
            };
            bearerOptions.RequireHttpsMetadata = false;
            bearerOptions.SaveToken = true;
            bearerOptions.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(jwt_key),
                ValidateIssuer = false,
                ValidateAudience = false,
            };
        });

        // Authorization policies
        services.AddAuthorizationBuilder()
                .AddPolicy("admin", policy => policy.RequireRole("admin"))
                .AddPolicy("user", policy => policy.RequireRole("user"));

        // User context
        services.AddScoped<UserContext>();

        return services;
    }

    public static IServiceCollection RegisterBasicServices(this IServiceCollection services, IConfiguration config)
    {
        // Cors
        var origins = new string[1] { config["CORS_ORIGIN"] ?? throw new Exception("CORS_ORIGIN Config Missing") };
        services.AddCors(options => options.AddPolicy("_corsPolicy", policy =>
        {
            // https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header

            policy.WithOrigins(origins)
                  .WithHeaders("Content-Type", "Content-Language", "Authorization", "Accept", "Range", "x-requested-with", "x-signalr-user-agent", "X-Automatic-Refresh") // client request
                  .WithExposedHeaders("X-Fresh-Token") // client response
                  .AllowCredentials();
        }));

        // Swagger
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyNotes Api", Description = "API for MyNotes app", Version = "v1" });
        });

        // Mailer
        services.AddScoped<IMailer, Mailer>();

        // SignalR
        services.AddSignalR();

        return services;
    }

    public static IServiceCollection RegisterDatabase(this IServiceCollection services, IConfiguration config, bool isProduction)
    {
        var connectionString = config["PG_CONNECTION_STRING"] ?? throw new Exception("PG_CONNECTION_STRING Config Missing");
        services.AddDbContext<Db>(options => options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());
        services.AddScoped<Services>();

        if (!isProduction)
        {
            // this captures database-related exceptions that can be resolved by using Entity Framework migrations
            services.AddDatabaseDeveloperPageExceptionFilter();
        }

        return services;
    }

    public static IServiceCollection RegisterGraphql(this IServiceCollection services)
    {
        services.AddGraphQLServer() // Graphql
                .RegisterService<Db>(ServiceKind.Synchronized) // Graphql dependency injection
                .RegisterService<Services>(ServiceKind.Synchronized) // Graphql dependency injection
                .RegisterService<UserContext>() // Graphql dependency injection
                .AddQueryType<Graphql.Query>() // Graphql
                .AddMutationType<Graphql.Mutation>() // Graphql
                .AddAuthorization() // Graphql
                .AddApiTypes(); // Graphql Types Analyser

        return services;
    }
}