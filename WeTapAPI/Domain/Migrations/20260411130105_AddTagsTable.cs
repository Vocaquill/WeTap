using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddTagsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_tags",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Slug = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_videos_tags",
                columns: table => new
                {
                    VideoId = table.Column<long>(type: "bigint", nullable: false),
                    TagId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_videos_tags", x => new { x.VideoId, x.TagId });
                    table.ForeignKey(
                        name: "FK_tbl_videos_tags_tbl_tags_TagId",
                        column: x => x.TagId,
                        principalTable: "tbl_tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_videos_tags_tbl_videos_VideoId",
                        column: x => x.VideoId,
                        principalTable: "tbl_videos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_tags_TagId",
                table: "tbl_videos_tags",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_videos_tags");

            migrationBuilder.DropTable(
                name: "tbl_tags");
        }
    }
}
