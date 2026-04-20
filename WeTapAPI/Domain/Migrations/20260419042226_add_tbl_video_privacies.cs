using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class add_tbl_video_privacies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "PrivacyId",
                table: "tbl_videos",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "ViewCount",
                table: "tbl_videos",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "tbl_video_privacies",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SystemCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_video_privacies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_PrivacyId",
                table: "tbl_videos",
                column: "PrivacyId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_tbl_video_privacies_PrivacyId",
                table: "tbl_videos",
                column: "PrivacyId",
                principalTable: "tbl_video_privacies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_tbl_video_privacies_PrivacyId",
                table: "tbl_videos");

            migrationBuilder.DropTable(
                name: "tbl_video_privacies");

            migrationBuilder.DropIndex(
                name: "IX_tbl_videos_PrivacyId",
                table: "tbl_videos");

            migrationBuilder.DropColumn(
                name: "PrivacyId",
                table: "tbl_videos");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "tbl_videos");
        }
    }
}
