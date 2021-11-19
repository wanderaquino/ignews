import { NextApiRequest, NextApiResponse } from "next";
import {query} from "faunadb";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/client";
import {fauna} from "../../services/fauna";

interface User {
    ref : {
        id: string
    }
    data: {
        stripe_customer_id: string
    }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if(request.method === "POST") {

        const session = await getSession({req: request});

        const user = await fauna.query<User>(
            query.Get(
                query.Match(
                    query.Index("users_email"),
                    query.Casefold(session.user.email)
                )
            )
        );

        let stripeCustomerId = user.data.stripe_customer_id;

        if (!stripeCustomerId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
            });
            
            await fauna.query(
                query.Update(
                    query.Ref(query.Collection("users"), user.ref.id), 
                    {
                        data: {stripe_customer_id: stripeCustomer.id }
                    }
                )
            )
            stripeCustomerId = stripeCustomer.id;
        }


        const stripeCheckoutSession = 
        await stripe.checkout.sessions.create(
            {
                customer: stripeCustomerId,
                payment_method_types: ["card"],
                billing_address_collection: "required",
                line_items: [
                    {price: "price_1JHdYZEOjZgdJA8hGOysY0NI", quantity:1}
                ],
                mode: "subscription",
                allow_promotion_codes: true,
                success_url: `${process.env.NEXTAUTH_URL}/posts`,
                cancel_url: `${process.env.NEXTAUTH_URL}`
            }
        )
        return response.status(200).json({sessionId: stripeCheckoutSession});
    } else {
        response.setHeader("Allow", "POST");
        response.status(405).end("Method not Allowes");
    }
};