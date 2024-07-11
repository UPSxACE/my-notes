using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NpgsqlTypes;

namespace Database;
// TODO: implement lastview_at
public class NoteModel
{
    // REVIEW: Analyse later if there isn't a better option (would DI work here somehow?)
    public Graphql.Note ToDto()
    {
        var noteTagModels = NoteTags != null ? NoteTags.ToList() : [];
        var noteTagNames = noteTagModels.Where(x => x?.NoteTag?.Name != null).Select(x => x.NoteTag.Name).ToList();

        return new Graphql.Note
        {
            Id = Id,
            UserId = UserId,
            Folder = Folder.Path,
            Title = Title,
            Content = Content,
            ContentText = ContentText,
            Tags = noteTagNames,
            Priority = Priority,
            Views = Views,
            CreatedAt = CreatedAt ?? DateTime.MinValue.ToUniversalTime()
        };
    }

    [Key] // v7
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required string Id { get; set; }
    public int UserId { get; set; }
    public string? FolderId { get; set; }
    public required string Title { get; set; }
    public string? Content { get; set; }
    public string? ContentText { get; set; }
    public int Priority { get; set; }
    public int Views { get; set; }
    public bool? Deleted { get; set; }
    public DateTime? LastreadAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public NpgsqlTsVector? SearchVector { get; set; }

    // Fks
    public virtual required UserModel User { get; set; }
    public virtual required FolderModel Folder { get; set; }
    // Navigations
    public virtual ICollection<NoteNoteTagModel>? NoteTags { get; set; }
}