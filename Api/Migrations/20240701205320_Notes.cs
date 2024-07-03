using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using NpgsqlTypes;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class Notes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "folder",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    path = table.Column<string>(type: "text", nullable: false),
                    priority = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_folder", x => x.id);
                    table.ForeignKey(
                        name: "fk_folder_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "note_tag",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_note_tag", x => x.id);
                    table.ForeignKey(
                        name: "fk_note_tag_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "note",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    folder_id = table.Column<string>(type: "text", nullable: true),
                    title = table.Column<string>(type: "text", nullable: true),
                    content = table.Column<string>(type: "text", nullable: true),
                    content_text = table.Column<string>(type: "text", nullable: true),
                    priority = table.Column<int>(type: "integer", nullable: false),
                    views = table.Column<int>(type: "integer", nullable: false),
                    deleted = table.Column<bool>(type: "boolean", nullable: true),
                    lastread_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    search_vector = table.Column<NpgsqlTsVector>(type: "tsvector", nullable: true)
                        .Annotation("Npgsql:TsVectorConfig", "english")
                        .Annotation("Npgsql:TsVectorProperties", new[] { "title", "content_text" })
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_note", x => x.id);
                    table.ForeignKey(
                        name: "fk_note_folder_folder_id",
                        column: x => x.folder_id,
                        principalTable: "folder",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_note_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "note_note_tag",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    note_id = table.Column<string>(type: "text", nullable: true),
                    note_tag_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_note_note_tag", x => x.id);
                    table.ForeignKey(
                        name: "fk_note_note_tag_note_note_id",
                        column: x => x.note_id,
                        principalTable: "note",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_note_note_tag_note_tag_note_tag_id",
                        column: x => x.note_tag_id,
                        principalTable: "note_tag",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ix_folder_user_id",
                table: "folder",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_note_created_at",
                table: "note",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_note_folder_id",
                table: "note",
                column: "folder_id");

            migrationBuilder.CreateIndex(
                name: "ix_note_priority",
                table: "note",
                column: "priority");

            migrationBuilder.CreateIndex(
                name: "ix_note_search_vector",
                table: "note",
                column: "search_vector")
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "ix_note_title",
                table: "note",
                column: "title");

            migrationBuilder.CreateIndex(
                name: "ix_note_user_id",
                table: "note",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_note_views",
                table: "note",
                column: "views");

            migrationBuilder.CreateIndex(
                name: "ix_note_note_tag_note_id",
                table: "note_note_tag",
                column: "note_id");

            migrationBuilder.CreateIndex(
                name: "ix_note_note_tag_note_tag_id",
                table: "note_note_tag",
                column: "note_tag_id");

            migrationBuilder.CreateIndex(
                name: "ix_note_tag_name",
                table: "note_tag",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_note_tag_user_id",
                table: "note_tag",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "note_note_tag");

            migrationBuilder.DropTable(
                name: "note");

            migrationBuilder.DropTable(
                name: "note_tag");

            migrationBuilder.DropTable(
                name: "folder");
        }
    }
}
