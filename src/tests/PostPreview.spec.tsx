import {screen, render} from "@testing-library/react";
import { debug } from "console";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import PostPreview, { getStaticProps } from "../pages/preview/[slug]";
import { getPrismicClient } from "../services/prismic";


const post = {
    slug: "new-test-post",
    title: "New Post",
    updatedAt: "03 de agosto",
    content: "Post Content"
};

jest.mock("../services/prismic");
jest.mock("next-auth/client");
jest.mock("next/router")

describe ("Posts preview page", () => {
    it("renders correctly", () => {

        const mockedUseSession = mocked(useSession);

        mockedUseSession.mockReturnValueOnce([{
            user: {
                name: "John Doe",
                email: "john@doe.com",
                image: "image.jpg"
            },
            expires: "fake-expires"
        }] as any);

        render(
            <PostPreview post={post} />
        )
        debug();
        expect(screen.getByText(`New Post`)).toBeInTheDocument();
        expect(screen.getByText(`03 de agosto`)).toBeInTheDocument();
        expect(screen.getByText(`Post Content`)).toBeInTheDocument();
        expect(screen.getByText(`Wanna continue reading?`)).toBeInTheDocument();
        expect(screen.getByText(`Subscribe now!`)).toBeInTheDocument();


    });

    it("redirects user to post page if subscription is found", async () => {
        const mockedUseSession = mocked(useSession);
        const mockedUseRouter = mocked(useRouter);
        const mockedPushFunction = jest.fn();
        mockedUseSession.mockReturnValueOnce([{
            user: {
                name: "John Doe",
                email: "john@doe.com",
                image: "image.jpg"
            },
            expires: "fake-expires",
            activeSubscription: "fake-active-subscription"
        }] as any);

        mockedUseRouter.mockReturnValueOnce({
            push: mockedPushFunction
        } as any)


        render(
            <PostPreview post={post} />
        )

        expect(mockedPushFunction).toHaveBeenCalledWith(`/posts/${post.slug}`);
    })

    it("loads initial data from post preview", async () => {

        const mockedUseSession = mocked(useSession);
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

        mockedUseSession.mockReturnValueOnce(null);


        const response = await getStaticProps({
            params: {slug: "my-new-post"}
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
                    }
                }
            )
        )
    })
})