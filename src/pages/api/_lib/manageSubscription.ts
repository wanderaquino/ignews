import {fauna} from "../../../services/fauna";
import { query } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription (
    subscriptionId: string,
    customerId: string,
) { 
    const userStripeId = await fauna.query(
        query.Select(
            "ref",
            query.Get(
                query.Match("user_stripe_id", customerId)
            ) 
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
        id: subscriptionId,
        userId: userStripeId,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    };

    await fauna.query(
        query.Create(
            query.Collection("subscriptions"), {data: subscriptionData})
    )
}