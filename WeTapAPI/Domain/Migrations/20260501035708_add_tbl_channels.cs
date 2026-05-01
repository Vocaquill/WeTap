using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class add_tbl_channels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ChannelEntityId",
                table: "tbl_videos",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "tbl_channels",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NickName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    AvatarImage = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    BannerImage = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_channels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tbl_channels_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tbl_channel_subscribers",
                columns: table => new
                {
                    ChannelId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    DateSubscribed = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_channel_subscribers", x => new { x.ChannelId, x.UserId });
                    table.ForeignKey(
                        name: "FK_tbl_channel_subscribers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_channel_subscribers_tbl_channels_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "tbl_channels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_ChannelEntityId",
                table: "tbl_videos",
                column: "ChannelEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_channel_subscribers_UserId",
                table: "tbl_channel_subscribers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_channels_NickName",
                table: "tbl_channels",
                column: "NickName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_channels_UserId",
                table: "tbl_channels",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_tbl_channels_ChannelEntityId",
                table: "tbl_videos",
                column: "ChannelEntityId",
                principalTable: "tbl_channels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_tbl_channels_ChannelEntityId",
                table: "tbl_videos");

            migrationBuilder.DropTable(
                name: "tbl_channel_subscribers");

            migrationBuilder.DropTable(
                name: "tbl_channels");

            migrationBuilder.DropIndex(
                name: "IX_tbl_videos_ChannelEntityId",
                table: "tbl_videos");

            migrationBuilder.DropColumn(
                name: "ChannelEntityId",
                table: "tbl_videos");
        }
    }
}
