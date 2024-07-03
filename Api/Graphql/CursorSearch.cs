namespace Graphql;
public record CursorSearch<TDto>(TDto Results, string? Cursor);