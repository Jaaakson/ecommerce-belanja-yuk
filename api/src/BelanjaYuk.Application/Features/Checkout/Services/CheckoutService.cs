using BelanjaYuk.Domain.Common;
using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Application.Common.Exceptions;
using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Application.Features.Checkout.Dtos;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Application.Features.Checkout.Services;

public class CheckoutService(
    IAppDbContext context,
    ICurrentUserService currentUserService) : ICheckoutService
{
    private const decimal ShippingCost = 0m;

    public async Task<CheckoutResponse> CheckoutAsync(
        CheckoutRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = currentUserService.UserId
            ?? throw new UnauthorizedException("Sesi tidak valid. Silakan login kembali.");

        var payment = await context.LtPayments
            .FirstOrDefaultAsync(
                p => p.IdPayment == request.IdPayment && p.IsActive,
                cancellationToken)
            ?? throw new NotFoundException("Metode pembayaran tidak ditemukan.");

        var cartItems = await context.TrBuyerCarts
            .Include(c => c.Product)
            .Where(c => c.IdUser == userId)
            .ToListAsync(cancellationToken);

        if (cartItems.Count == 0)
        {
            throw new ConflictException("Keranjang kosong.");
        }

        // Prices are read from the product rows tracked in this transaction,
        // never from the client, and are then frozen into the detail rows.
        var transaction = new TrBuyerTransaction
        {
            IdBuyerTransaction = NewId(),
            IdUser = userId,
            IdPayment = payment.IdPayment,
            FinalPrice = 0m
        };

        var lines = new List<CheckoutLine>(cartItems.Count);
        decimal subtotal = 0m;
        decimal totalDiscount = 0m;

        foreach (var cartItem in cartItems)
        {
            var product = cartItem.Product
                ?? throw new NotFoundException("Produk pada keranjang tidak ditemukan.");

            if (product.Qty < cartItem.Qty)
            {
                throw new ConflictException(
                    $"Stok {product.ProductName} tersisa {product.Qty}, tidak cukup untuk {cartItem.Qty} item.");
            }

            var finalUnitPrice = PricingCalculator.ApplyDiscount(product.Price, product.DiscountProduct);
            var lineSubtotal = finalUnitPrice * cartItem.Qty;

            subtotal += product.Price * cartItem.Qty;
            totalDiscount += (product.Price - finalUnitPrice) * cartItem.Qty;

            context.TrBuyerTransactionDetails.Add(new TrBuyerTransactionDetail
            {
                IdBuyerTransactionDetail = NewId(),
                IdBuyerTransaction = transaction.IdBuyerTransaction,
                IdProduct = product.IdProduct,
                Qty = cartItem.Qty,
                PriceProduct = product.Price,
                DiscountProduct = product.DiscountProduct
            });

            product.Qty -= cartItem.Qty;
            cartItem.IsActive = false;

            lines.Add(new CheckoutLine(
                product.ProductName,
                cartItem.Qty,
                product.Price,
                product.DiscountProduct,
                lineSubtotal));
        }

        transaction.FinalPrice = subtotal - totalDiscount + ShippingCost;
        context.TrBuyerTransactions.Add(transaction);

        // One SaveChanges wraps the header, details, stock decrement, and cart
        // clearing in a single implicit transaction: either all of it lands or
        // none of it does.
        await context.SaveChangesAsync(cancellationToken);

        return new CheckoutResponse(
            transaction.IdBuyerTransaction,
            payment.PaymentName,
            subtotal,
            totalDiscount,
            ShippingCost,
            transaction.FinalPrice,
            transaction.DateIn,
            lines);
    }

    private static string NewId() => Guid.NewGuid().ToString();
}
