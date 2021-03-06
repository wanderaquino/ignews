import { NextAuthRequest, NextAuthResponse } from "next-auth/internals";
import { Readable } from "stream";
import Stripe from "stripe";
import {stripe} from "../../../services/stripe";
import {saveSubscription} from "../_lib/manageSubscription"

async function buffer(readable: Readable) {
    const chunks = [];

    for await(const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        )
    }

    return Buffer.concat(chunks);
}

export const config = {
    api : {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted"
]);

export default async function (request: NextAuthRequest, response: NextAuthResponse) {
    if (request.method === "POST") {
        const buf = await buffer(request);
        const secret = request.headers["stripe-signature"];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_SECRET_HOOK)
        } catch (err) {
            return response.status(400).send(`Webhook Error: ${err.message}`)
        }

        const {type} = event;

        if(relevantEvents.has(type)) {
            try{
            switch (type) {
                case "customer.subscription.created":
                case "customer.subscription.updated":
                case "customer.subscription.deleted":
                    const subscription = event.data.object as Stripe.Subscription;
                    
                    await saveSubscription(
                        subscription.id, 
                        subscription.customer.toString(), 
                        type === "customer.subscription.created"
                    );

                break;
                case "checkout.session.completed":
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    await saveSubscription(checkoutSession.subscription.toString(),checkoutSession.customer.toString()
                    );
                    
                    break;
                default:
                    throw new Error("Unhandled Event");
                }
            } catch (err) {
                return response.json({error: "Webhook handler Error", description: err})
            }
        }
    }
    console.log("Received Event");
    response.json({message: "Ok!"});
}