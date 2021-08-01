import Head from "next/head";
import {stripe} from "../services/stripe";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home(props: HomeProps) {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span><img src="/images/palmas.png"></img> Hey, welcome</span>
        <h1>News About the <span>React</span> world</h1>
        <p>Get access to all the publications <br /> <span>for {props.product.amount} month</span></p>
        <SubscribeButton priceId={props.product.priceId}/>
      </section>
      <img className={styles.girlCoding} src="/images/mulher.svg" alt="Girl coding" />
    </main>
    </>
  )
}

export async function getStaticProps <GetStaticProps> () {
  const price = await stripe.prices.retrieve("price_1JHdYZEOjZgdJA8hGOysY0NI", {expand:["product"]});
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format((price.unit_amount/100))
  }
  
  return {
    props : {
      product
    },
    revalidate: 60 * 60 * 24 // 24 horas
  }
}