import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/client";

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if(request.method === "POST") {
        const session = await getSession({req: request});
        const stripeCustomer = await stripe.customers.create({
            email: session.user.email
        })
        const stripeCheckoutSession = 
        await stripe.checkout.sessions.create(
            {
                customer: stripeCustomer.id,
                payment_method_types: ["card"],
                billing_address_collection: "required",
                line_items: [
                    {price: "price_1JHdYZEOjZgdJA8hGOysY0NI", quantity:1}
                ],
                mode: "subscription",
                allow_promotion_codes: true,
                success_url: "http://localhost:3000/posts",
                cancel_url: "http://localhost:3000/"
            }
        )
        return response.status(200).json({sessionId: stripeCheckoutSession});
    } else {
        response.setHeader("Allow", "POST");
        response.status(405).end("Method not Allowes");
    }
};