using BelanjaYuk.Domain.Common;
using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Application.Common.Exceptions;
using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Application.Features.Cart.Dtos;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Application.Features.Cart.Services;

public class CartService(
    IAppDbContext context,
    ICurrentUserService currentUserService) : ICartService
{
    // The specification fixes shipping at zero ("gratis ongkir"); the ERD has
    // no column for it, so it stays a constant rather than persisted state.
    private const decimal ShippingCost = 0m;

    private const int MaxQuantityPerItem = 99;

    public Task<CartSummary> GetAsync(CancellationToken cancellationToken = default) =>
        BuildSummaryAsync(RequireUserId(), cancellationToken);

    public async Task<CartSummary> AddAsync(
        AddToCartRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = RequireUserId();

        var product = await context.MsProducts
            .FirstOrDefaultAsync(p => p.IdProduct == request.IdProduct, cancellationToken)
            ?? throw new NotFoundException("Produk tidak ditemukan.");

        var existing = await context.TrBuyerCarts
            .FirstOrDefaultAsync(
                c => c.IdUser == userId && c.IdProduct == request.IdProduct,
                cancellationToken);

        var resultingQty = (existing?.Qty ?? 0) + request.Qty;

        if (resultingQty > MaxQuantityPerItem)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                [nameof(request.Qty)] = [$"Jumlah barang maksimal {MaxQuantityPerItem}."]
            });
        }

        EnsureStockIsSufficient(product, resultingQty);

        if (existing is not null)
        {
            existing.Qty = resultingQty;
        }
        else
        {
            context.TrBuyerCarts.Add(new TrBuyerCart
            {
                IdBuyerCart = Guid.NewGuid().ToString(),
                IdUser = userId,
                IdProduct = request.IdProduct,
                Qty = request.Qty
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return await BuildSummaryAsync(userId, cancellationToken);
    }

    public async Task<CartSummary> UpdateQuantityAsync(
        string idBuyerCart,
        int qty,
        CancellationToken cancellationToken = default)
    {
        var userId = RequireUserId();
        var item = await FindOwnedItemAsync(idBuyerCart, userId, cancellationToken);

        var product = await context.MsProducts
            .FirstOrDefaultAsync(p => p.IdProduct == item.IdProduct, cancellationToken)
            ?? throw new NotFoundException("Produk tidak ditemukan.");

        EnsureStockIsSufficient(product, qty);

        item.Qty = qty;
        await context.SaveChangesAsync(cancellationToken);

        return await BuildSummaryAsync(userId, cancellationToken);
    }

    public async Task<CartSummary> RemoveAsync(
        string idBuyerCart,
        CancellationToken cancellationToken = default)
    {
        var userId = RequireUserId();
        var item = await FindOwnedItemAsync(idBuyerCart, userId, cancellationToken);

        // Soft delete: the row stays for audit purposes and disappears from
        // reads through the global query filter.
        item.IsActive = false;
        await context.SaveChangesAsync(cancellationToken);

        return await BuildSummaryAsync(userId, cancellationToken);
    }

    private async Task<CartSummary> BuildSummaryAsync(
        string userId,
        CancellationToken cancellationToken)
    {
        var rows = await context.TrBuyerCarts
            .AsNoTracking()
            .Where(c => c.IdUser == userId)
            .OrderBy(c => c.DateIn)
            .Select(c => new
            {
                c.IdBuyerCart,
                c.IdProduct,
                c.Qty,
                c.Product!.ProductName,
                c.Product.Price,
                c.Product.DiscountProduct,
                AvailableStock = c.Product.Qty,
                ThumbnailUrl = c.Product.Images
                    .Where(i => i.IsActive)
                    .Select(i => i.ProductImage)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        var items = rows
            .Select(r =>
            {
                var finalPrice = PricingCalculator.ApplyDiscount(r.Price, r.DiscountProduct);

                return new CartItem(
                    r.IdBuyerCart,
                    r.IdProduct,
                    r.ProductName,
                    r.ThumbnailUrl,
                    r.Price,
                    r.DiscountProduct,
                    finalPrice,
                    (r.Price - finalPrice) * r.Qty,
                    r.Qty,
                    r.AvailableStock,
                    finalPrice * r.Qty);
            })
            .ToList();

        // Subtotal uses the original price so the discount line matches the
        // mockup, where the saving is shown as a separate deduction.
        var subtotal = items.Sum(i => i.Price * i.Qty);
        var totalDiscount = items.Sum(i => i.DiscountAmount);

        return new CartSummary(
            items,
            subtotal,
            totalDiscount,
            ShippingCost,
            subtotal - totalDiscount + ShippingCost);
    }

    private async Task<TrBuyerCart> FindOwnedItemAsync(
        string idBuyerCart,
        string userId,
        CancellationToken cancellationToken)
    {
        // Ownership is part of the lookup, not a separate check afterwards:
        // a mismatched user gets "not found" and learns nothing about whether
        // the cart row exists.
        return await context.TrBuyerCarts
            .FirstOrDefaultAsync(
                c => c.IdBuyerCart == idBuyerCart && c.IdUser == userId,
                cancellationToken)
            ?? throw new NotFoundException("Item keranjang tidak ditemukan.");
    }

    private static void EnsureStockIsSufficient(MsProduct product, int requestedQty)
    {
        if (product.Qty < requestedQty)
        {
            throw new ConflictException($"Stok {product.ProductName} tersisa {product.Qty}.");
        }
    }

    private string RequireUserId() =>
        currentUserService.UserId
        ?? throw new UnauthorizedException("Sesi tidak valid. Silakan login kembali.");
}
