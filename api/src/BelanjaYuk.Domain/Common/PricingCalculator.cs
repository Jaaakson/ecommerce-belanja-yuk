namespace BelanjaYuk.Domain.Common;

/// <summary>
/// Single source of truth for discount arithmetic. Product listing, cart, and
/// checkout must agree on the final price, so the formula lives in one place.
/// </summary>
public static class PricingCalculator
{
    public static decimal ApplyDiscount(decimal price, decimal? discountPercentage)
    {
        if (discountPercentage is null or <= 0)
        {
            return price;
        }

        var discounted = price * (1 - discountPercentage.Value / 100m);

        // Rupiah has no minor unit in practice; rounding here prevents fractional
        // cents from accumulating across cart line items.
        return Math.Round(discounted, 0, MidpointRounding.AwayFromZero);
    }
}
