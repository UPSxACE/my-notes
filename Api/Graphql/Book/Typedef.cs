namespace Graphql;

public record struct Book(int Id, string Title, int AuthorId, string? Notes);