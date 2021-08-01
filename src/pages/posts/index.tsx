import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Prismic from "@prismicio/client";
import {getPrismicClient} from "../../services/prismic";
import styles from "./styles.module.scss";
import {RichText} from "prismic-dom"

interface Posts {
    posts: PostContent[] 
}

interface PostContent {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: Date
}
export default function Posts ({posts}: Posts) {  
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.post}>
                    {posts.map(post => {
                        return (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                        )
                    })}
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
        fetch: ["post.title","post.post-content"],
        pageSize: 100
    });

    const posts = response.results.map((post) => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data["post-content"].find(content => content.type === "paragraph")?.text ?? "",
            updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
        }
    })
    return {
        props: {
            posts
        }
    }
}