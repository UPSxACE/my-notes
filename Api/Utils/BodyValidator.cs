namespace Utils;

using FluentValidation;

public class BodyValidator<T, Y> : IEndpointFilter where T : AbstractValidator<Y>, new()
{

    // The body to be validated must be injected in the first parameter of the route function in order for this function to work.
    // If the request body is null by any chance, it will return 400 (bad request).
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var body = context.GetArgument<Y>(0);
        if (body == null) return Results.BadRequest(); // if body is null return 400

        var validator = new T();
        var validation = await validator.ValidateAsync(body);
        if (!validation.IsValid) return Results.ValidationProblem(validation.ToDictionary());

        return await next(context);
    }
}
