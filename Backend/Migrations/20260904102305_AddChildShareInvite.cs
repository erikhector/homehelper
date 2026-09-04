using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HomeHelper.Migrations
{
    /// <inheritdoc />
    public partial class AddChildShareInvite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChildShareInvites",
                columns: table => new
                {
                    ChildShareInviteId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChildId = table.Column<int>(type: "integer", nullable: false),
                    InvitedEmail = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    NormalizedInvitedEmail = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    InvitedByUserId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    RespondedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChildShareInvites", x => x.ChildShareInviteId);
                    table.ForeignKey(
                        name: "FK_ChildShareInvites_Children_ChildId",
                        column: x => x.ChildId,
                        principalTable: "Children",
                        principalColumn: "ChildId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChildShareInvites_Users_InvitedByUserId",
                        column: x => x.InvitedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChildShareInvites_ChildId",
                table: "ChildShareInvites",
                column: "ChildId");

            migrationBuilder.CreateIndex(
                name: "IX_ChildShareInvites_InvitedByUserId",
                table: "ChildShareInvites",
                column: "InvitedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChildShareInvites");
        }
    }
}
