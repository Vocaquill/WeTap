using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class fix_video_channel_rel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_tbl_channels_ChannelEntityId",
                table: "tbl_videos");

            migrationBuilder.DropIndex(
                name: "IX_tbl_videos_ChannelEntityId",
                table: "tbl_videos");

            migrationBuilder.DropColumn(
                name: "ChannelEntityId",
                table: "tbl_videos");

            migrationBuilder.AddColumn<long>(
                name: "ChannelId",
                table: "tbl_videos",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_ChannelId",
                table: "tbl_videos",
                column: "ChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_tbl_channels_ChannelId",
                table: "tbl_videos",
                column: "ChannelId",
                principalTable: "tbl_channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_videos_tbl_channels_ChannelId",
                table: "tbl_videos");

            migrationBuilder.DropIndex(
                name: "IX_tbl_videos_ChannelId",
                table: "tbl_videos");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                table: "tbl_videos");

            migrationBuilder.AddColumn<long>(
                name: "ChannelEntityId",
                table: "tbl_videos",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_videos_ChannelEntityId",
                table: "tbl_videos",
                column: "ChannelEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_videos_tbl_channels_ChannelEntityId",
                table: "tbl_videos",
                column: "ChannelEntityId",
                principalTable: "tbl_channels",
                principalColumn: "Id");
        }
    }
}
