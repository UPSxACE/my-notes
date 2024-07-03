namespace Graphql;
public record PathNodes(List<Note> Notes, List<string> Folders, string? Cursor);
// public record PathNodes(List<Note> Notes, Folder Folders, string Cursor); //FIXME Graphql.Folder