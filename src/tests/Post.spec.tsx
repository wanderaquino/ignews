import {screen, render} from "@testing-library/react";
import { debug } from "console";
import { getSession } from "next-auth/client";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { mocked } from "ts-jest/utils";
import Post, { getServerSideProps } from "../pages/posts/[slug]";
import { getPrismicClient } from "../services/prismic";


const post = {
    slug: "new-test-post",
    title: "New Post",
    excerpt: "Post excerpt",
    updatedAt: "03 de agosto",
    content: "Post Content"
};

jest.mock("../services/prismic");
jest.mock("next-auth/client")

describe ("Posts page", () => {
    it("renders correctly", () => {
        render(
            <Post post={post} />
        )
        debug();
        expect(screen.getByText(`New Post`)).toBeInTheDocument();
        expect(screen.getByText(`03 de agosto`)).toBeInTheDocument();
        expect(screen.getByText(`Post Content`)).toBeInTheDocument();

    });

    it("redirects user if no subscription is found", async () => {
        const mockedGetSession = mocked(getSession);
        mockedGetSession.mockResolvedValueOnce({
            activeSubscription: null
        });

        const response = await getServerSideProps({
            params: {
                slug: "my-new-post",
            },
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: "/"
                })
            })
        )
    })


    it("redirects user if subscription is found", async () => {
        const mockedGetSession = mocked(getSession);
        mockedGetSession.mockResolvedValueOnce({
            activeSubscription: "fake-active-subscription"
        });

        const mockedGetPrismicClient = mocked(getPrismicClient);
        mockedGetPrismicClient.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{type: "heading", text: "Post Title"}],
                    "post-content": [{type: "paragraph", text: "Post Excerpt"}]
                },
                last_publication_date: "08-03-2021"
            })
        } as any);

        const response = await getServerSideProps({
            params: {
                slug: "my-new-post",
            },
        } as any)

        expect(response).toEqual(
            expect.objectContaining(
                {
                    props: {
                        post:{
                            slug: "my-new-post",
                            title: "Post Title",
                            content: "<p>Post Excerpt</p>",
                            updatedAt: "03 de agosto de 2021"
                        }
                    },
                    redirect: 60 * 30 //30 minutos
                }
            )
        )
    })

    it("loads initial data", async () => {
        const mockedGetSession = mocked(getSession);
        mockedGetSession.mockResolvedValueOnce(null);

        const mockedGetPrismicClient = mocked(getPrismicClient);

        mockedGetPrismicClient.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{type: "heading", text: "Post Title"}],
                    "post-content": [{type: "paragraph", text: "Post Excerpt"}]
                },
                last_publication_date: "08-03-2021"
            })
        } as any);


        const response = await getServerSideProps({
            params: {slug: "my-new-post"}
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: "/"
                })
            })
        )
    })
})