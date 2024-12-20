﻿using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class SearchFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "search_vector",
                table: "note");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "note",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "note",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<NpgsqlTsVector>(
                name: "search_vector",
                table: "note",
                type: "tsvector",
                nullable: true);
        }
    }
}
