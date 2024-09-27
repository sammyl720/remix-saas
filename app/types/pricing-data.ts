import Stripe from "stripe";

export interface PricingData {
    priceId: string;
    productName: string;
    unitAmount: number | null;
    interval?: Stripe.Price.Recurring.Interval;
    currency: string;
    description: string | null
}