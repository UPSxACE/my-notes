using System.Linq.Expressions;
using System.Text.RegularExpressions;
using Database;
using FluentValidation;
using Mail;
using Microsoft.EntityFrameworkCore;
using Passwords;
using Utils;

namespace Routes;

public static partial class AuthRoutesExtension
{
    public static RouteGroupBuilder MapAuthRoutes(this RouteGroupBuilder app)
    {
        RegisterLoginRoutes(ref app);
        RegisterRegisterRoutes(ref app);
        RegisterConfirmationMailRoutes(ref app);
        RegisterResetPasswordRoutes(ref app);
        // TODO: Setup react with graphql auto generated types
        // TODO: Deploy app
        // TODO: Setup web sockets and try something with it and graphql
        // TODO: Unit testing

        return app;
    }
}

// Types
