import {fauna} from "../../../services/fauna";
import { query } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription (
    subscriptionId: string,
    customerId: string,
    createAction = false
) { 
    console.log(subscriptionId);
    console.log(createAction);

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
        id: subscription.id,
        userId: userStripeId,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    };
    
    if(createAction) {
        await fauna.query(
            query.Create(
                query.Collection("subscriptions"), {data: subscriptionData})
        )
    } else {
        await fauna.query(
            //Replace substitui a subscription por completo
            query.Replace(
                query.Select(
                    "ref",  
                    query.Get(
                        query.Match(
                            query.Index("subscription_by_id"),
                            subscriptionData.id
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}