using BelanjaYuk.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Infrastructure.Persistence.Seeding;

/// <summary>
/// Populates reference data and demo records required by the assessment.
/// Every step is guarded by an existence check so the seeder can run on
/// every startup without duplicating rows.
/// </summary>
public class DatabaseSeeder(AppDbContext context)
{
    private const string DemoSellerCode = "JACK-0001";

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await SeedGendersAsync(cancellationToken);
        await SeedCategoriesAsync(cancellationToken);
        await SeedPaymentsAsync(cancellationToken);
        await SeedDemoSellerAsync(cancellationToken);
        await SeedProductsAsync(cancellationToken);
    }

    private async Task SeedGendersAsync(CancellationToken cancellationToken)
    {
        if (await context.LtGenders.AnyAsync(cancellationToken))
        {
            return;
        }

        context.LtGenders.AddRange(
            new LtGender { IdGender = NewId(), GenderName = "Laki-laki" },
            new LtGender { IdGender = NewId(), GenderName = "Perempuan" });

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedCategoriesAsync(CancellationToken cancellationToken)
    {
        if (await context.LtCategories.AnyAsync(cancellationToken))
        {
            return;
        }

        string[] names = ["Elektronik", "Fashion", "Rumah Tangga", "Olahraga", "Makanan"];

        context.LtCategories.AddRange(
            names.Select(name => new LtCategory { IdCategory = NewId(), CategoryName = name }));

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedPaymentsAsync(CancellationToken cancellationToken)
    {
        if (await context.LtPayments.AnyAsync(cancellationToken))
        {
            return;
        }

        context.LtPayments.AddRange(
            new LtPayment { IdPayment = NewId(), PaymentName = "Transfer Bank" },
            new LtPayment { IdPayment = NewId(), PaymentName = "COD (Bayar di tempat)" });

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedDemoSellerAsync(CancellationToken cancellationToken)
    {
        if (await context.MsUserSellers.AnyAsync(cancellationToken))
        {
            return;
        }

        var genderId = await context.LtGenders
            .Where(g => g.GenderName == "Laki-laki")
            .Select(g => g.IdGender)
            .FirstAsync(cancellationToken);

        var user = new MsUser
        {
            IdUser = NewId(),
            UserName = "jakson_mau_jualan",
            Email = "jakson_junior@belanjayuk.com",
            PhoneNumber = "086767676767",
            FirstName = "Toko",
            LastName = "Jack",
            IdGender = genderId
        };

        var seller = new MsUserSeller
        {
            IdUserSeller = NewId(),
            IdUser = user.IdUser,
            SellerName = "Toko Jack",
            SellerDesc = "Demo",
            Address = "Binus Skuare",
            SellerCode = DemoSellerCode,
            PhoneNumber = "086767676767"
        };

        context.MsUsers.Add(user);
        context.MsUserSellers.Add(seller);

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedProductsAsync(CancellationToken cancellationToken)
    {
        if (await context.MsProducts.AnyAsync(cancellationToken))
        {
            return;
        }

        var sellerId = await context.MsUserSellers
            .Where(s => s.SellerCode == DemoSellerCode)
            .Select(s => s.IdUserSeller)
            .FirstAsync(cancellationToken);

        var categories = await context.LtCategories
            .ToDictionaryAsync(c => c.CategoryName, c => c.IdCategory, cancellationToken);

        // Prices and discounts mirror the provided UI mockup so the cart
        // calculation can be verified against a known expected total.
        (string Name, string Category, decimal Price, decimal? Discount, int Qty, string Image)[] catalogue =
        [
            ("Headset Bluetooth", "Elektronik", 289_000m, 10m, 50, "https://placehold.co/400x400?text=Headset"),
            ("Keyboard Mekanik", "Elektronik", 499_000m, null, 30, "https://placehold.co/400x400?text=Keyboard"),
            ("Kemeja Polo", "Fashion", 159_000m, 15m, 80, "https://placehold.co/400x400?text=Kemeja"),
            ("Jaket Anti Dingin", "Fashion", 279_000m, null, 40, "https://placehold.co/400x400?text=Jaket"),
            ("Botol Tumbler", "Rumah Tangga", 99_000m, null, 120, "https://placehold.co/400x400?text=Tumbler"),
            ("Peralatan Panci", "Rumah Tangga", 359_000m, null, 25, "https://placehold.co/400x400?text=Panci"),
            ("Sepatu Lari", "Olahraga", 399_000m, null, 35, "https://placehold.co/400x400?text=Sepatu"),
            ("Dumbbell Gym 20kg", "Olahraga", 149_000m, null, 60, "https://placehold.co/400x400?text=Dumbbell"),
            ("Kopi Enak Banget Cik 200g", "Makanan", 69_000m, null, 200, "https://placehold.co/400x400?text=Kopi"),
            ("Indomie Goreng", "Makanan", 19_900m, null, 500, "https://placehold.co/400x400?text=Mi")
        ];

        foreach (var item in catalogue)
        {
            var product = new MsProduct
            {
                IdProduct = NewId(),
                IdUserSeller = sellerId,
                ProductName = item.Name,
                ProductDesc = $"{item.Name} - Testing.",
                IdCategory = categories[item.Category],
                Price = item.Price,
                DiscountProduct = item.Discount,
                Qty = item.Qty
            };

            context.MsProducts.Add(product);
            context.TrProductImages.Add(new TrProductImages
            {
                IdProductImages = NewId(),
                IdProduct = product.IdProduct,
                ProductImage = item.Image
            });
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private static string NewId() => Guid.NewGuid().ToString();
}
