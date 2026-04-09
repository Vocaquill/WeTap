using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class fix_tbl_vieos_genres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VideoGenresEntity_tbl_genres_GenreId",
                table: "VideoGenresEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoGenresEntity_tbl_videos_VideoId",
                table: "VideoGenresEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VideoGenresEntity",
                table: "VideoGenresEntity");

            migrationBuilder.RenameTable(
                name: "VideoGenresEntity",
                newName: "tbl_vieos_genres");

            migrationBuilder.RenameIndex(
                name: "IX_VideoGenresEntity_GenreId",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                newName: "VideoGenresEntity");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_vieos_genres_GenreId",
                table: "VideoGenresEntity",
                newName: "IX_VideoGenresEntity_GenreId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VideoGenresEntity",
                table: "VideoGenresEntity",
                columns: new[] { "VideoId", "GenreId" });

            migrationBuilder.AddForeignKey(
                name: "FK_VideoGenresEntity_tbl_genres_GenreId",
                table: "VideoGenresEntity",
                column: "GenreId",
                principalTable: "tbl_genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoGenresEntity_tbl_videos_VideoId",
                table: "VideoGenresEntity",
                column: "VideoId",
                principalTable: "tbl_videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
