using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeHelper.Migrations
{
    /// <inheritdoc />
    public partial class MakeTemplatesChildOwned : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemTemplates_Users_CreatedByUserId",
                table: "ItemTemplates");

            migrationBuilder.DropIndex(
                name: "IX_ItemTemplates_CreatedByUserId",
                table: "ItemTemplates");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "ItemTemplates");

            migrationBuilder.Sql("DELETE FROM [ItemTemplates]");

            migrationBuilder.AddColumn<int>(
                name: "ChildId",
                table: "ItemTemplates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "ItemTemplateEntries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ItemTemplateEntryId",
                table: "Items",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ActiveItemTemplateId",
                table: "Children",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemTemplates_ChildId",
                table: "ItemTemplates",
                column: "ChildId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_ItemTemplateEntryId",
                table: "Items",
                column: "ItemTemplateEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_Children_ActiveItemTemplateId",
                table: "Children",
                column: "ActiveItemTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Children_ItemTemplates_ActiveItemTemplateId",
                table: "Children",
                column: "ActiveItemTemplateId",
                principalTable: "ItemTemplates",
                principalColumn: "ItemTemplateId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_ItemTemplateEntries_ItemTemplateEntryId",
                table: "Items",
                column: "ItemTemplateEntryId",
                principalTable: "ItemTemplateEntries",
                principalColumn: "ItemTemplateEntryId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemTemplates_Children_ChildId",
                table: "ItemTemplates",
                column: "ChildId",
                principalTable: "Children",
                principalColumn: "ChildId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Children_ItemTemplates_ActiveItemTemplateId",
                table: "Children");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_ItemTemplateEntries_ItemTemplateEntryId",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemTemplates_Children_ChildId",
                table: "ItemTemplates");

            migrationBuilder.DropIndex(
                name: "IX_ItemTemplates_ChildId",
                table: "ItemTemplates");

            migrationBuilder.DropIndex(
                name: "IX_Items_ItemTemplateEntryId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Children_ActiveItemTemplateId",
                table: "Children");

            migrationBuilder.DropColumn(
                name: "ChildId",
                table: "ItemTemplates");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "ItemTemplateEntries");

            migrationBuilder.DropColumn(
                name: "ItemTemplateEntryId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ActiveItemTemplateId",
                table: "Children");

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "ItemTemplates",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemTemplates_CreatedByUserId",
                table: "ItemTemplates",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemTemplates_Users_CreatedByUserId",
                table: "ItemTemplates",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
