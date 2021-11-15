import {screen, render} from "@testing-library/react";
import { debug } from "console";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import Posts, { getStaticProps } from "../pages/posts/index";
import {stripe} from "../services/stripe";
import { getPrismicClient } from "../services/prismic";

const posts = [
    {
        slug: "new-test-post",
        title: "New Post",
        excerpt: "Post excerpt",
        updatedAt: "03 de agosto"
    }
];

jest.mock("../services/prismic");

describe ("Posts page", () => {
    it("renders correctly", () => {
        render(
            <Posts posts={posts} />
        )
        debug();
        expect(screen.getByText(`New Post`)).toBeInTheDocument();
        expect(screen.getByText(`Post excerpt`)).toBeInTheDocument();
        expect(screen.getByText(`03 de agosto`)).toBeInTheDocument();

    })

    it("loads initial post data", async () => {
        const mockedGetPrismicClient = mocked(getPrismicClient);
        const mockedPrismicQueryResults = jest.fn().mockResolvedValueOnce({
            results: [{
                uid: "my-new-post",
                data: {
                    title: [{type:"heading", text: "Post Title"}],
                    "post-content": [{type:"paragraph", text: "Post Excerpt"}]
                },
                last_publication_date: "08-03-2021"
            }]
        });

        mockedGetPrismicClient.mockReturnValueOnce({
            query: mockedPrismicQueryResults
        } as any);

        const response = await getStaticProps({})

        expect(response).toEqual(expect.objectContaining({
            props: {
                posts: [{
                    slug: "my-new-post",
                    title: "Post Title",
                    excerpt: "Post Excerpt",
                    updatedAt: "03 de agosto de 2021"
                }]
            }
        }))
    })
})