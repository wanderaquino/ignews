import Head from "next/head";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
      <span><img src="/images/palmas.png"></img> Hey, welcome</span>
      <h1>News About the <span>React</span> world</h1>
      <p>Get access to all the publications <br /> <span>for $ 9.90 month</span></p>
      <button type="button">Subscribe now</button>
      </section>
      <img className={styles.girlCoding} src="/images/mulher.svg" alt="Girl coding" />
    </main>
    </>
  )
}
