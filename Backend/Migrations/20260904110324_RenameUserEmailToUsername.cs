using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeHelper.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserEmailToUsername : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_NormalizedEmail",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "NormalizedEmail",
                table: "Users",
                newName: "NormalizedUsername");

            migrationBuilder.RenameColumn(
                name: "NormalizedInvitedEmail",
                table: "ChildShareInvites",
                newName: "NormalizedInvitedUsername");

            migrationBuilder.RenameColumn(
                name: "InvitedEmail",
                table: "ChildShareInvites",
                newName: "InvitedUsername");

            migrationBuilder.CreateIndex(
                name: "IX_Users_NormalizedUsername",
                table: "Users",
                column: "NormalizedUsername",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_NormalizedUsername",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "NormalizedUsername",
                table: "Users",
                newName: "NormalizedEmail");

            migrationBuilder.RenameColumn(
                name: "NormalizedInvitedUsername",
                table: "ChildShareInvites",
                newName: "NormalizedInvitedEmail");

            migrationBuilder.RenameColumn(
                name: "InvitedUsername",
                table: "ChildShareInvites",
                newName: "InvitedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Users_NormalizedEmail",
                table: "Users",
                column: "NormalizedEmail",
                unique: true);
        }
    }
}
