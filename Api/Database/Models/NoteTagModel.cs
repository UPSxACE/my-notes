using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NpgsqlTypes;

namespace Database;
public class NoteTagModel
{
    [Key] // v7
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required string Id { get; set; }
    public int UserId { get; set; }
    public required string Name { get; set; }

    // Fks
    public virtual required UserModel User { get; set; }
}