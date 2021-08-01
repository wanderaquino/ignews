import { GetStaticProps } from "next";
import Head from "next/head";
import Prismic from "@prismicio/client";
import {getPrismicClient} from "../../services/prismic";
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

export const getStaticProps : GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.predicates.at("document.type", "post")
    ], {
        fetch: ["post.title","post.content"],
        pageSize: 100
    });

    console.log(response);

    return {
        props: {}
    }
}