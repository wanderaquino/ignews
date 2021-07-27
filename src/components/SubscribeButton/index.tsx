import styles from "./styles.module.scss";


interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton (subscribeProps: SubscribeButtonProps) {
    return (
        <button type="button" className={styles.subscribeButton}>
            
            Subscribe now
        
        </button>
    )
}