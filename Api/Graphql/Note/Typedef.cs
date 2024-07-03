namespace Graphql;

public record struct Note(string Id, int UserId, string Folder, string? Title, string? Content, string? ContentText, List<string> Tags, int Priority, int Views, DateTime CreatedAt);