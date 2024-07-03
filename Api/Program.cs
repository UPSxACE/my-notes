using Extensions;
using Passwords;
using Routes;


var builder = WebApplication.CreateBuilder(args);
var isProduction = builder.Environment.IsProduction();
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddHttpContextAccessor();
builder.Services.RegisterAuthServices(builder.Configuration, isProduction);
builder.Services.RegisterBasicServices(builder.Configuration);
builder.Services.RegisterDatabase(builder.Configuration, isProduction);
builder.Services.RegisterGraphql();

var app = builder.Build();
app.UseGlobalMiddlewares();
app.MapRoutes();

app.Run();
