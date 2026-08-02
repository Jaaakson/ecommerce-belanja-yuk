using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BelanjaYuk.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LtCategory",
                columns: table => new
                {
                    IdCategory = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LtCategory", x => x.IdCategory);
                });

            migrationBuilder.CreateTable(
                name: "LtGender",
                columns: table => new
                {
                    IdGender = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    GenderName = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LtGender", x => x.IdGender);
                });

            migrationBuilder.CreateTable(
                name: "LtPayment",
                columns: table => new
                {
                    IdPayment = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    PaymentName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LtPayment", x => x.IdPayment);
                });

            migrationBuilder.CreateTable(
                name: "MsUser",
                columns: table => new
                {
                    IdUser = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Firstname = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    DOB = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IdGender = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MsUser", x => x.IdUser);
                    table.ForeignKey(
                        name: "FK_MsUser_LtGender_IdGender",
                        column: x => x.IdGender,
                        principalTable: "LtGender",
                        principalColumn: "IdGender",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MsUserPassword",
                columns: table => new
                {
                    IdUserPassword = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdUser = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MsUserPassword", x => x.IdUserPassword);
                    table.ForeignKey(
                        name: "FK_MsUserPassword_MsUser_IdUser",
                        column: x => x.IdUser,
                        principalTable: "MsUser",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MsUserSeller",
                columns: table => new
                {
                    IdUserSeller = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdUser = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    SellerName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    SellerDesc = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SellerCode = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MsUserSeller", x => x.IdUserSeller);
                    table.ForeignKey(
                        name: "FK_MsUserSeller_MsUser_IdUser",
                        column: x => x.IdUser,
                        principalTable: "MsUser",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrBuyerTransaction",
                columns: table => new
                {
                    IdBuyerTransaction = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdUser = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdPayment = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    FinalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    RatingComment = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrBuyerTransaction", x => x.IdBuyerTransaction);
                    table.ForeignKey(
                        name: "FK_TrBuyerTransaction_LtPayment_IdPayment",
                        column: x => x.IdPayment,
                        principalTable: "LtPayment",
                        principalColumn: "IdPayment",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrBuyerTransaction_MsUser_IdUser",
                        column: x => x.IdUser,
                        principalTable: "MsUser",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrHomeAddress",
                columns: table => new
                {
                    IdhomeAddress = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdUser = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    Provinsi = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    KotaKabupaten = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Kecamatan = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    KodePos = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    HomeAddressDesc = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    IsPrimaryAddress = table.Column<bool>(type: "bit", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrHomeAddress", x => x.IdhomeAddress);
                    table.ForeignKey(
                        name: "FK_TrHomeAddress_MsUser_IdUser",
                        column: x => x.IdUser,
                        principalTable: "MsUser",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MsProduct",
                columns: table => new
                {
                    IdProduct = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdUserSeller = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    ProductDesc = table.Column<string>(type: "nvarchar(2000)", nullable: true),
                    IdCategory = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiscountProduct = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    Qty = table.Column<int>(type: "int", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MsProduct", x => x.IdProduct);
                    table.ForeignKey(
                        name: "FK_MsProduct_LtCategory_IdCategory",
                        column: x => x.IdCategory,
                        principalTable: "LtCategory",
                        principalColumn: "IdCategory",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MsProduct_MsUserSeller_IdUserSeller",
                        column: x => x.IdUserSeller,
                        principalTable: "MsUserSeller",
                        principalColumn: "IdUserSeller",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrBuyerCart",
                columns: table => new
                {
                    IdBuyerCart = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdUser = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdProduct = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    Qty = table.Column<int>(type: "int", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrBuyerCart", x => x.IdBuyerCart);
                    table.ForeignKey(
                        name: "FK_TrBuyerCart_MsProduct_IdProduct",
                        column: x => x.IdProduct,
                        principalTable: "MsProduct",
                        principalColumn: "IdProduct",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrBuyerCart_MsUser_IdUser",
                        column: x => x.IdUser,
                        principalTable: "MsUser",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrBuyerTransactionDetail",
                columns: table => new
                {
                    IdBuyerTransactionDetail = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdBuyerTransaction = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdProduct = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    Qty = table.Column<int>(type: "int", nullable: false),
                    PriceProduct = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiscountProduct = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    RatingComment = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrBuyerTransactionDetail", x => x.IdBuyerTransactionDetail);
                    table.ForeignKey(
                        name: "FK_TrBuyerTransactionDetail_MsProduct_IdProduct",
                        column: x => x.IdProduct,
                        principalTable: "MsProduct",
                        principalColumn: "IdProduct",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrBuyerTransactionDetail_TrBuyerTransaction_IdBuyerTransaction",
                        column: x => x.IdBuyerTransaction,
                        principalTable: "TrBuyerTransaction",
                        principalColumn: "IdBuyerTransaction",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrProductImages",
                columns: table => new
                {
                    IdProductImages = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    IdProduct = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    ProductImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateIn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserIn = table.Column<string>(type: "nvarchar(36)", nullable: false),
                    DateUp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserUp = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrProductImages", x => x.IdProductImages);
                    table.ForeignKey(
                        name: "FK_TrProductImages_MsProduct_IdProduct",
                        column: x => x.IdProduct,
                        principalTable: "MsProduct",
                        principalColumn: "IdProduct",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MsProduct_IdCategory",
                table: "MsProduct",
                column: "IdCategory");

            migrationBuilder.CreateIndex(
                name: "IX_MsProduct_IdUserSeller",
                table: "MsProduct",
                column: "IdUserSeller");

            migrationBuilder.CreateIndex(
                name: "IX_MsUser_Email",
                table: "MsUser",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MsUser_IdGender",
                table: "MsUser",
                column: "IdGender");

            migrationBuilder.CreateIndex(
                name: "IX_MsUser_PhoneNumber",
                table: "MsUser",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MsUser_UserName",
                table: "MsUser",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MsUserPassword_IdUser",
                table: "MsUserPassword",
                column: "IdUser",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MsUserSeller_IdUser",
                table: "MsUserSeller",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_MsUserSeller_SellerCode",
                table: "MsUserSeller",
                column: "SellerCode",
                unique: true,
                filter: "[SellerCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TrBuyerCart_IdProduct",
                table: "TrBuyerCart",
                column: "IdProduct");

            migrationBuilder.CreateIndex(
                name: "IX_TrBuyerCart_IdUser_IdProduct",
                table: "TrBuyerCart",
                columns: new[] { "IdUser", "IdProduct" });

            migrationBuilder.CreateIndex(
                name: "IX_TrBuyerTransaction_IdPayment",
                table: "TrBuyerTransaction",
                column: "IdPayment");

            migrationBuilder.CreateIndex(
                name: "IX_TrBuyerTransaction_IdUser",
                table: "TrBuyerTransaction",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_TrBuyerTransactionDetail_IdBuyerTransaction",
                table: "TrBuyerTransactionDetail",
                column: "IdBuyerTransaction");

            migrationBuilder.CreateIndex(
                name: "IX_TrBuyerTransactionDetail_IdProduct",
                table: "TrBuyerTransactionDetail",
                column: "IdProduct");

            migrationBuilder.CreateIndex(
                name: "IX_TrHomeAddress_IdUser",
                table: "TrHomeAddress",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_TrProductImages_IdProduct",
                table: "TrProductImages",
                column: "IdProduct");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MsUserPassword");

            migrationBuilder.DropTable(
                name: "TrBuyerCart");

            migrationBuilder.DropTable(
                name: "TrBuyerTransactionDetail");

            migrationBuilder.DropTable(
                name: "TrHomeAddress");

            migrationBuilder.DropTable(
                name: "TrProductImages");

            migrationBuilder.DropTable(
                name: "TrBuyerTransaction");

            migrationBuilder.DropTable(
                name: "MsProduct");

            migrationBuilder.DropTable(
                name: "LtPayment");

            migrationBuilder.DropTable(
                name: "LtCategory");

            migrationBuilder.DropTable(
                name: "MsUserSeller");

            migrationBuilder.DropTable(
                name: "MsUser");

            migrationBuilder.DropTable(
                name: "LtGender");
        }
    }
}
