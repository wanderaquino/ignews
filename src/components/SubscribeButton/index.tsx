import styles from "./styles.module.scss";
import {useSession, signIn} from "next-auth/client";
import { getStripeJs } from "../../services/stripe.js";
import { useRouter } from "next/router";

export function SubscribeButton () {
    const [session] = useSession();
    const router = useRouter();

    async function handleSubscribe () {
        if(!session) {
            signIn("github");
            return;
        }

        if (session?.activeSubscription) {
            router.push("/posts");
            return;
        }
        const response = await fetch(`${process.env.VERCEL_URL}/api/createCheckoutSession`, {
            method: "POST",
        }).then(response => response.json()).catch(response => console.log(response));

        const stripe = await getStripeJs();
        await stripe.redirectToCheckout({sessionId: response.sessionId.id});
    }

    return (
        <button 
            type="button" 
            className={styles.subscribeButton}
            onClick={handleSubscribe}    
        >
            
            Subscribe now
        
        </button>
    )
}