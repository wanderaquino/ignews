import styles from "./styles.module.scss";
import {useSession, signIn} from "next-auth/client";
import { getStripeJs } from "../../services/stripe.js";

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton (subscribeProps: SubscribeButtonProps) {
    const [session] = useSession();

    async function handleSubscribe () {
        if(!session) {
            signIn("github");
            return;
        }
        const response = await fetch("http://localhost:3000/api/createCheckoutSession", {
            method: "POST",
        }).then(response => response.json());

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