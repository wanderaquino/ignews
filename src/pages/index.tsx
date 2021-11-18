import Head from "next/head";
import {stripe} from "../services/stripe";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";
import { GetStaticProps } from "next";
import girlCoding from "../../public/images/mulher.svg";
import Image from "next/image";
import palmas from "../../public/images/palmas.png";

interface HomeProps {
  product: {
    priceId: string,
    amount: string
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
        <span><Image src={palmas} /> Hey, welcome</span>
        <h1>News About the <span>React</span> world</h1>
        <p>Get access to all the publications <br /> <span>for {props.product.amount} month</span></p>
        <SubscribeButton/>
      </section>
      <Image className={styles.girlCoding} src={girlCoding} alt="Girl coding" />
    </main>
    </>
  )
}

export const getStaticProps : GetStaticProps = async () => {
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