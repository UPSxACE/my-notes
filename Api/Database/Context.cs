namespace Database;

using Microsoft.EntityFrameworkCore;

public class Db(DbContextOptions options) : DbContext(options)
{
    public DbSet<UserModel> Users { get; set; }
    public DbSet<MailModel> Mails { get; set; }
    public DbSet<ConfirmationMailModel> ConfirmationMails { get; set; }
    public DbSet<RecoveryMailModel> RecoveryMails { get; set; }
    public DbSet<FolderModel> Folders { get; set; }
    public DbSet<NoteModel> Notes { get; set; }
    public DbSet<NoteTagModel> NoteTags { get; set; }
    public DbSet<NoteNoteTagModel> NoteNoteTags { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // trigrams extension for fuzzy search
        modelBuilder.HasPostgresExtension("pg_trgm");

        // User
        modelBuilder.Entity<UserModel>().ToTable("user");
        modelBuilder.Entity<UserModel>().Property(e => e.CreatedAt).HasDefaultValueSql("now()");
        modelBuilder.Entity<UserModel>().Property(e => e.Verified).HasDefaultValue(false);
        modelBuilder.Entity<UserModel>().Property(e => e.Deleted).HasDefaultValue(false);
        modelBuilder.Entity<UserModel>().HasIndex(e => e.Username);
        modelBuilder.Entity<UserModel>().HasIndex(e => e.Email);

        // Mail
        modelBuilder.Entity<MailModel>().ToTable("mail");
        modelBuilder.Entity<MailModel>().Property(e => e.Sent).HasDefaultValue(false);
        modelBuilder.Entity<MailModel>().HasIndex(e => e.Reason);

        // ConfirmationMail
        modelBuilder.Entity<ConfirmationMailModel>().ToTable("confirmation_mail");
        modelBuilder.Entity<ConfirmationMailModel>().Property(e => e.CreatedAt).HasDefaultValueSql("now()");
        modelBuilder.Entity<ConfirmationMailModel>().HasIndex(e => e.Uid);
        modelBuilder.Entity<ConfirmationMailModel>().HasIndex(e => e.UserID);
        modelBuilder.Entity<ConfirmationMailModel>().HasIndex(e => e.MailID);
        modelBuilder.Entity<ConfirmationMailModel>().HasIndex(e => e.Code);

        // RecoveryMail
        modelBuilder.Entity<RecoveryMailModel>().ToTable("recovery_mail");
        modelBuilder.Entity<RecoveryMailModel>().Property(e => e.CreatedAt).HasDefaultValueSql("now()");
        modelBuilder.Entity<RecoveryMailModel>().HasIndex(e => e.Uid);
        modelBuilder.Entity<RecoveryMailModel>().HasIndex(e => e.UserID);
        modelBuilder.Entity<RecoveryMailModel>().HasIndex(e => e.MailID);

        // Folder
        modelBuilder.Entity<FolderModel>().ToTable("folder");
        modelBuilder.Entity<FolderModel>().HasIndex(e => e.UserId);

        // Note
        modelBuilder.Entity<NoteModel>().ToTable("note");
        modelBuilder.Entity<NoteModel>().Property(e => e.CreatedAt).HasDefaultValueSql("now()");
        modelBuilder.Entity<NoteModel>().Property(e => e.Deleted).HasDefaultValue(false);
        modelBuilder.Entity<NoteModel>().HasIndex(e => e.Title);
        modelBuilder.Entity<NoteModel>().HasIndex(e => e.Priority);
        modelBuilder.Entity<NoteModel>().HasIndex(e => e.Views);
        modelBuilder.Entity<NoteModel>().HasIndex(e => e.CreatedAt);
        modelBuilder.Entity<NoteModel>().HasIndex(e => e.UserId);
        modelBuilder.Entity<NoteModel>().Property(b => b.FolderId);
        modelBuilder.Entity<NoteModel>().HasGeneratedTsVectorColumn(e => e.SearchVector!, "english", e => new { e.Title, e.ContentText })
                                        .HasIndex(e => e.SearchVector)
                                        .HasMethod("GIN");
        /*
        var searchTerm = "Jungle"; // Example search term
        var searchVector = NpgsqlTsVector.Parse(searchTerm);
        var blogs = context.Blogs
            .Where(p => p.SearchVector.Matches(searchTerm))
            .OrderByDescending(td => td.SearchVector.Rank(EF.Functions.ToTsQuery(searchTerm))).ToList();
        */

        // NoteTags
        modelBuilder.Entity<NoteTagModel>().ToTable("note_tag");
        modelBuilder.Entity<NoteTagModel>().HasIndex(e => e.Name);
        modelBuilder.Entity<NoteTagModel>().HasIndex(e => e.UserId);

        // NoteNoteTags
        modelBuilder.Entity<NoteNoteTagModel>().ToTable("note_note_tag");
        modelBuilder.Entity<NoteNoteTagModel>().HasIndex(e => e.NoteId);
        modelBuilder.Entity<NoteNoteTagModel>().HasIndex(e => e.NoteTagId);
    }
}