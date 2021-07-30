import { NextAuthRequest, NextAuthResponse } from "next-auth/internals";
import { Readable } from "stream";
import Stripe from "stripe";
import {stripe} from "../../../services/stripe";

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
    "checkout.session.completed"
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
            console.log("Webhook event:", event);
        }

    }
    console.log("Received Event");
    response.json({message: "Ok!"});
}