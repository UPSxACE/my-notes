using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NpgsqlTypes;

namespace Database;
public class FolderModel
{
    public Graphql.Folder ToDto(int notesCount, DateTime? lastNoteAdded)
    {
        return new Graphql.Folder
        {
            Id = Id,
            Path = Path,
            UserId = UserId,
            Priority = Priority,
            NotesCount = notesCount,
            LastNoteAdded = lastNoteAdded
        };
    }

    [Key] // v7
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required string Id { get; set; }
    public int UserId { get; set; }
    public required string Path { get; set; }
    public int Priority { get; set; }

    // Fks
    public virtual required UserModel User { get; set; }
}