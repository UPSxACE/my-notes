﻿// <auto-generated />
using System;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using NpgsqlTypes;

#nullable disable

namespace Api.Migrations
{
    [DbContext(typeof(Db))]
    [Migration("20240703231000_CodeString")]
    partial class CodeString
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresExtension(modelBuilder, "pg_trgm");
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Database.ConfirmationMailModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("code");

                    b.Property<DateTime?>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("now()");

                    b.Property<int>("MailID")
                        .HasColumnType("integer")
                        .HasColumnName("mail_id");

                    b.Property<string>("Uid")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("uid");

                    b.Property<DateTime?>("UsedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("used_at");

                    b.Property<int>("UserID")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("ID")
                        .HasName("pk_confirmation_mail");

                    b.HasIndex("Code")
                        .HasDatabaseName("ix_confirmation_mail_code");

                    b.HasIndex("MailID")
                        .HasDatabaseName("ix_confirmation_mail_mail_id");

                    b.HasIndex("Uid")
                        .HasDatabaseName("ix_confirmation_mail_uid");

                    b.HasIndex("UserID")
                        .HasDatabaseName("ix_confirmation_mail_user_id");

                    b.ToTable("confirmation_mail", (string)null);
                });

            modelBuilder.Entity("Database.FolderModel", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text")
                        .HasColumnName("id");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("path");

                    b.Property<int>("Priority")
                        .HasColumnType("integer")
                        .HasColumnName("priority");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_folder");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_folder_user_id");

                    b.ToTable("folder", (string)null);
                });

            modelBuilder.Entity("Database.MailModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<DateTime?>("LastAttempt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_attempt");

                    b.Property<string>("Reason")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("reason");

                    b.Property<bool?>("Sent")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false)
                        .HasColumnName("sent");

                    b.Property<DateTime?>("SentAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("sent_at");

                    b.HasKey("ID")
                        .HasName("pk_mail");

                    b.HasIndex("Reason")
                        .HasDatabaseName("ix_mail_reason");

                    b.ToTable("mail", (string)null);
                });

            modelBuilder.Entity("Database.NoteModel", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .HasColumnType("text")
                        .HasColumnName("content");

                    b.Property<string>("ContentText")
                        .HasColumnType("text")
                        .HasColumnName("content_text");

                    b.Property<DateTime?>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("now()");

                    b.Property<bool?>("Deleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false)
                        .HasColumnName("deleted");

                    b.Property<DateTime?>("DeletedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("deleted_at");

                    b.Property<string>("FolderId")
                        .HasColumnType("text")
                        .HasColumnName("folder_id");

                    b.Property<DateTime?>("LastreadAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("lastread_at");

                    b.Property<int>("Priority")
                        .HasColumnType("integer")
                        .HasColumnName("priority");

                    b.Property<NpgsqlTsVector>("SearchVector")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("tsvector")
                        .HasColumnName("search_vector")
                        .HasAnnotation("Npgsql:TsVectorConfig", "english")
                        .HasAnnotation("Npgsql:TsVectorProperties", new[] { "Title", "ContentText" });

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("title");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.Property<int>("Views")
                        .HasColumnType("integer")
                        .HasColumnName("views");

                    b.HasKey("Id")
                        .HasName("pk_note");

                    b.HasIndex("CreatedAt")
                        .HasDatabaseName("ix_note_created_at");

                    b.HasIndex("FolderId")
                        .HasDatabaseName("ix_note_folder_id");

                    b.HasIndex("Priority")
                        .HasDatabaseName("ix_note_priority");

                    b.HasIndex("SearchVector")
                        .HasDatabaseName("ix_note_search_vector");

                    NpgsqlIndexBuilderExtensions.HasMethod(b.HasIndex("SearchVector"), "GIN");

                    b.HasIndex("Title")
                        .HasDatabaseName("ix_note_title");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_note_user_id");

                    b.HasIndex("Views")
                        .HasDatabaseName("ix_note_views");

                    b.ToTable("note", (string)null);
                });

            modelBuilder.Entity("Database.NoteNoteTagModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("NoteId")
                        .HasColumnType("text")
                        .HasColumnName("note_id");

                    b.Property<string>("NoteTagId")
                        .HasColumnType("text")
                        .HasColumnName("note_tag_id");

                    b.HasKey("Id")
                        .HasName("pk_note_note_tag");

                    b.HasIndex("NoteId")
                        .HasDatabaseName("ix_note_note_tag_note_id");

                    b.HasIndex("NoteTagId")
                        .HasDatabaseName("ix_note_note_tag_note_tag_id");

                    b.ToTable("note_note_tag", (string)null);
                });

            modelBuilder.Entity("Database.NoteTagModel", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text")
                        .HasColumnName("id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_note_tag");

                    b.HasIndex("Name")
                        .HasDatabaseName("ix_note_tag_name");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_note_tag_user_id");

                    b.ToTable("note_tag", (string)null);
                });

            modelBuilder.Entity("Database.RecoveryMailModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<DateTime?>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("now()");

                    b.Property<int>("MailID")
                        .HasColumnType("integer")
                        .HasColumnName("mail_id");

                    b.Property<string>("Uid")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("uid");

                    b.Property<DateTime?>("UsedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("used_at");

                    b.Property<int>("UserID")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("ID")
                        .HasName("pk_recovery_mail");

                    b.HasIndex("MailID")
                        .HasDatabaseName("ix_recovery_mail_mail_id");

                    b.HasIndex("Uid")
                        .HasDatabaseName("ix_recovery_mail_uid");

                    b.HasIndex("UserID")
                        .HasDatabaseName("ix_recovery_mail_user_id");

                    b.ToTable("recovery_mail", (string)null);
                });

            modelBuilder.Entity("Database.UserModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<DateTime?>("BannedUntil")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("banned_until");

                    b.Property<DateTime?>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("now()");

                    b.Property<bool?>("Deleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false)
                        .HasColumnName("deleted");

                    b.Property<DateTime?>("DeletedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("deleted_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("email");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("full_name");

                    b.Property<string>("Password")
                        .HasColumnType("text")
                        .HasColumnName("password");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("username");

                    b.Property<bool?>("Verified")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false)
                        .HasColumnName("verified");

                    b.HasKey("ID")
                        .HasName("pk_user");

                    b.HasIndex("Email")
                        .HasDatabaseName("ix_user_email");

                    b.HasIndex("Username")
                        .HasDatabaseName("ix_user_username");

                    b.ToTable("user", (string)null);
                });

            modelBuilder.Entity("Database.ConfirmationMailModel", b =>
                {
                    b.HasOne("Database.MailModel", "Mail")
                        .WithMany()
                        .HasForeignKey("MailID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_confirmation_mail_mail_mail_id");

                    b.HasOne("Database.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_confirmation_mail_user_user_id");

                    b.Navigation("Mail");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Database.FolderModel", b =>
                {
                    b.HasOne("Database.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_folder_user_user_id");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Database.NoteModel", b =>
                {
                    b.HasOne("Database.FolderModel", "Folder")
                        .WithMany()
                        .HasForeignKey("FolderId")
                        .HasConstraintName("fk_note_folder_folder_id");

                    b.HasOne("Database.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_note_user_user_id");

                    b.Navigation("Folder");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Database.NoteNoteTagModel", b =>
                {
                    b.HasOne("Database.NoteModel", "Note")
                        .WithMany()
                        .HasForeignKey("NoteId")
                        .HasConstraintName("fk_note_note_tag_note_note_id");

                    b.HasOne("Database.NoteTagModel", "NoteTag")
                        .WithMany()
                        .HasForeignKey("NoteTagId")
                        .HasConstraintName("fk_note_note_tag_note_tag_note_tag_id");

                    b.Navigation("Note");

                    b.Navigation("NoteTag");
                });

            modelBuilder.Entity("Database.NoteTagModel", b =>
                {
                    b.HasOne("Database.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_note_tag_user_user_id");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Database.RecoveryMailModel", b =>
                {
                    b.HasOne("Database.MailModel", "Mail")
                        .WithMany()
                        .HasForeignKey("MailID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_recovery_mail_mail_mail_id");

                    b.HasOne("Database.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_recovery_mail_user_user_id");

                    b.Navigation("Mail");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
