using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class make_slug_unique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_Slug",
                table: "tbl_videos",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_video_languages_LanguageCode",
                table: "tbl_video_languages",
                column: "LanguageCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_tags_Name",
                table: "tbl_tags",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_tags_Slug",
                table: "tbl_tags",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_genres_Slug",
                table: "tbl_genres",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tbl_videos_Slug",
                table: "tbl_videos");

            migrationBuilder.DropIndex(
                name: "IX_tbl_video_languages_LanguageCode",
                table: "tbl_video_languages");

            migrationBuilder.DropIndex(
                name: "IX_tbl_tags_Name",
                table: "tbl_tags");

            migrationBuilder.DropIndex(
                name: "IX_tbl_tags_Slug",
                table: "tbl_tags");

            migrationBuilder.DropIndex(
                name: "IX_tbl_genres_Slug",
                table: "tbl_genres");
        }
    }
}
