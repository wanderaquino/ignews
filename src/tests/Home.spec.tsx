import {screen, render} from "@testing-library/react";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import Home, { getStaticProps } from "../pages/index";
import {stripe} from "../services/stripe";

jest.mock("next-auth/client");
jest.mock("../services/stripe")

describe ("Home page", () => {
    it("renders correctly", () => {
        const mockedUseSession = mocked(useSession);

        mockedUseSession.mockReturnValueOnce([
            null,
            false
        ]);

        render(
            <Home product={{
                    priceId: "priceId",
                    amount: "10"
            }}></Home>
        )
        expect(screen.getByText(`for 10 month`)).toBeInTheDocument();
    })

    it("loads initial data", async () => {
        const mockedStripeRetrievePrices = mocked(stripe.prices.retrieve);

        mockedStripeRetrievePrices.mockResolvedValueOnce({
            id: "fake-price-id",
            unit_amount: 1000
        } as any);

        const response = await getStaticProps({})

        expect(response).toEqual(expect.objectContaining({
            props: {
                product: {
                    priceId: "fake-price-id",
                    amount: "$10.00"
                }
            }
        }))
    })
})