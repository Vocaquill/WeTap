using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class fix_one_to_one : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_channels_AspNetUsers_UserId",
                table: "tbl_channels");

            migrationBuilder.DropIndex(
                name: "IX_tbl_channels_UserId",
                table: "tbl_channels");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "tbl_channels");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "tbl_channels",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_channels_AspNetUsers_Id",
                table: "tbl_channels",
                column: "Id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_channels_AspNetUsers_Id",
                table: "tbl_channels");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "tbl_channels",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "tbl_channels",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_tbl_channels_UserId",
                table: "tbl_channels",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_channels_AspNetUsers_UserId",
                table: "tbl_channels",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
