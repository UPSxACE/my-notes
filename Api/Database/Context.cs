namespace Database;

using Microsoft.EntityFrameworkCore;

public class Db(DbContextOptions options) : DbContext(options)
{
    public DbSet<UserModel> Users { get; set; }
    public DbSet<MailModel> Mails { get; set; }
    public DbSet<ConfirmationMailModel> ConfirmationMails { get; set; }
    public DbSet<RecoveryMailModel> RecoveryMails { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
    }
}