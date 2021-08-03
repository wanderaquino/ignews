import { GetStaticProps } from "next"
import { getSession, signIn, useSession } from "next-auth/client"
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import Head from "next/head";
import styles from "./postPreview.module.scss";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
    post: {
        slug: string,
        title: string,
        updatedAt: Date
        content: string
    }
}

export default function PostPreview ({post}: PostPreviewProps) {
    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`);
        }
    }, [session]);
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                    className={`${styles.postContent} ${styles.previewContent}`} 
                    dangerouslySetInnerHTML={{__html: post.content}} />

                    <div className={styles.continueReading}>
                        Wanna continue reading? 
                        <Link href="/">
                            <a >Subscribe now!</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const {slug} = params;
    const prismic = getPrismicClient();
    const response = await prismic.getByUID("post", String(slug), {});
    
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data[`post-content`].splice(0,2)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }
    
    return {
        props: {post}
    }
}