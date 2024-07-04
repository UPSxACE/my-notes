namespace Graphql;
public record PathNodes(List<Note> Notes, List<Folder> Folders, string? Cursor);