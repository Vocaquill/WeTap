using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class add_tbl_video_languages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_vieos_genres_tbl_genres_GenreId",
                table: "tbl_vieos_genres");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_vieos_genres_tbl_videos_VideoId",
                table: "tbl_vieos_genres");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_vieos_genres",
                table: "tbl_vieos_genres");

            migrationBuilder.RenameTable(
                name: "tbl_vieos_genres",
                newName: "tbl_videos_genres");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_vieos_genres_GenreId",
                table: "tbl_videos_genres",
                newName: "IX_tbl_videos_genres_GenreId");

            migrationBuilder.AddColumn<long>(
                name: "LanguageId",
                table: "tbl_videos",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_videos_genres",
                table: "tbl_videos_genres",
                columns: new[] { "VideoId", "GenreId" });

            migrationBuilder.CreateTable(
                name: "tbl_video_languages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LanguageCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_video_languages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_LanguageId",
                table: "tbl_videos",
                column: "LanguageId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_tbl_video_languages_LanguageId",
                table: "tbl_videos",
                column: "LanguageId",
                principalTable: "tbl_video_languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_genres_tbl_genres_GenreId",
                table: "tbl_videos_genres",
                column: "GenreId",
                principalTable: "tbl_genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_genres_tbl_videos_VideoId",
                table: "tbl_videos_genres",
                column: "VideoId",
                principalTable: "tbl_videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_tbl_video_languages_LanguageId",
                table: "tbl_videos");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_genres_tbl_genres_GenreId",
                table: "tbl_videos_genres");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_genres_tbl_videos_VideoId",
                table: "tbl_videos_genres");

            migrationBuilder.DropTable(
                name: "tbl_video_languages");

            migrationBuilder.DropIndex(
                name: "IX_tbl_videos_LanguageId",
                table: "tbl_videos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_videos_genres",
                table: "tbl_videos_genres");

            migrationBuilder.DropColumn(
                name: "LanguageId",
                table: "tbl_videos");

            migrationBuilder.RenameTable(
                name: "tbl_videos_genres",
                newName: "tbl_vieos_genres");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_videos_genres_GenreId",
                table: "tbl_vieos_genres",
                newName: "IX_tbl_vieos_genres_GenreId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_vieos_genres",
                table: "tbl_vieos_genres",
                columns: new[] { "VideoId", "GenreId" });

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_vieos_genres_tbl_genres_GenreId",
                table: "tbl_vieos_genres",
                column: "GenreId",
                principalTable: "tbl_genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_vieos_genres_tbl_videos_VideoId",
                table: "tbl_vieos_genres",
                column: "VideoId",
                principalTable: "tbl_videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
