import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts () {  
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.post}>
                    <a href="">
                        <time>01 de agosto de 2021</time>
                        <strong>Creating a new application using nextJs</strong>
                        <p>A simple guide to explain how to create an application using nextjs</p>
                    </a>
                    <a href="">
                        <time>01 de agosto de 2021</time>
                        <strong>Creating a new application using nextJs</strong>
                        <p>A simple guide to explain how to create an application using nextjs</p>
                    </a>
                    <a href="">
                        <time>01 de agosto de 2021</time>
                        <strong>Creating a new application using nextJs</strong>
                        <p>A simple guide to explain how to create an application using nextjs</p>
                    </a>
                </div>
            </main>
        </>
    )
}