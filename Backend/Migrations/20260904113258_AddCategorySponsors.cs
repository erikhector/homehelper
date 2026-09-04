using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HomeHelper.Migrations
{
    /// <inheritdoc />
    public partial class AddCategorySponsors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CategorySponsors",
                columns: table => new
                {
                    CategorySponsorId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RetailerName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UrlTemplate = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategorySponsors", x => x.CategorySponsorId);
                });

            migrationBuilder.InsertData(
                table: "CategorySponsors",
                columns: new[] { "CategorySponsorId", "Category", "RetailerName", "UrlTemplate" },
                values: new object[,]
                {
                    { 1, "Blöjor", "Exempel Babybutik", "https://example.com/sok?parti=homehelper&fraga={itemName}" },
                    { 2, "Kläder", "Exempel Barnkläder", "https://example.com/sok?parti=homehelper&fraga={itemName}" },
                    { 3, "Skor", "Exempel Skobutik", "https://example.com/sok?parti=homehelper&fraga={itemName}" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategorySponsors_Category",
                table: "CategorySponsors",
                column: "Category",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategorySponsors");
        }
    }
}
