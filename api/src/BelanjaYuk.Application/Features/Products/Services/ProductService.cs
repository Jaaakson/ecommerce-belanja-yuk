using BelanjaYuk.Domain.Common;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.Common.Exceptions;
using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Application.Features.Products.Dtos;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Application.Features.Products.Services;

public class ProductService(IAppDbContext context) : IProductService
{
    private const int MaxPageSize = 50;

    public async Task<PagedResult<ProductListItem>> GetAsync(
        ProductQuery query,
        CancellationToken cancellationToken = default)
    {
        var page = Math.Max(query.Page, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, MaxPageSize);

        var products = context.MsProducts.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var keyword = query.Search.Trim();
            products = products.Where(p => p.ProductName.Contains(keyword));
        }

        if (!string.IsNullOrWhiteSpace(query.IdCategory))
        {
            products = products.Where(p => p.IdCategory == query.IdCategory);
        }

        var totalItems = await products.CountAsync(cancellationToken);

        // Projection happens in SQL: only the columns below leave the database,
        // and the image subquery returns a single row per product instead of
        // loading every image for the grid.
        var items = await products
            .OrderBy(p => p.ProductName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.IdProduct,
                p.ProductName,
                CategoryName = p.Category!.CategoryName,
                p.Price,
                p.DiscountProduct,
                p.Qty,
                ThumbnailUrl = p.Images
                    .Where(i => i.IsActive)
                    .Select(i => i.ProductImage)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        var result = items
            .Select(p => new ProductListItem(
                p.IdProduct,
                p.ProductName,
                p.CategoryName,
                p.Price,
                p.DiscountProduct,
                PricingCalculator.ApplyDiscount(p.Price, p.DiscountProduct),
                p.Qty,
                p.ThumbnailUrl))
            .ToList();

        return new PagedResult<ProductListItem>(result, page, pageSize, totalItems);
    }

    public async Task<ProductDetail> GetByIdAsync(
        string idProduct,
        CancellationToken cancellationToken = default)
    {
        var product = await context.MsProducts
            .AsNoTracking()
            .Where(p => p.IdProduct == idProduct)
            .Select(p => new
            {
                p.IdProduct,
                p.ProductName,
                p.ProductDesc,
                p.IdCategory,
                CategoryName = p.Category!.CategoryName,
                SellerName = p.Seller!.SellerName,
                p.Price,
                p.DiscountProduct,
                p.Qty,
                Images = p.Images
                    .Where(i => i.IsActive)
                    .Select(i => i.ProductImage)
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (product is null)
        {
            throw new NotFoundException("Produk tidak ditemukan.");
        }

        return new ProductDetail(
            product.IdProduct,
            product.ProductName,
            product.ProductDesc,
            product.IdCategory,
            product.CategoryName,
            product.SellerName,
            product.Price,
            product.DiscountProduct,
            PricingCalculator.ApplyDiscount(product.Price, product.DiscountProduct),
            product.Qty,
            product.Images);
    }
}