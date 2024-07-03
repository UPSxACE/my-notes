using System.ComponentModel.DataAnnotations;
using NpgsqlTypes;

namespace Database;
public class NoteNoteTagModel
{
    public int Id { get; set; }
    public string? NoteId { get; set; }
    public string? NoteTagId { get; set; }

    // Fks
    public virtual required NoteModel Note { get; set; }
    public virtual required NoteTagModel NoteTag { get; set; }
}