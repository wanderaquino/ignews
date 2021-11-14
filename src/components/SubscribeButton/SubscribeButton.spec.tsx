import { render, screen, fireEvent} from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession, signIn} from "next-auth/client";
import {useRouter} from "next/router"
import { SubscribeButton } from ".";

jest.mock("next-auth/client");
jest.mock("next/router")


describe("SubscribeButton component", () => {

    it("renders correctly", () => {
        const mockedUseSession = mocked(useSession);
        mockedUseSession.mockReturnValueOnce([
            null,
            false
        ]);

        const {getByText} = render (
            <SubscribeButton />
        )
    
        expect(getByText("Subscribe now")).toBeInTheDocument();
    });

    it("redirects correctly when user is not authenticated", () => {
        const mockedUseSession = mocked(useSession);
        mockedUseSession.mockReturnValueOnce([
            null,
            false
        ]);
        const mockedSignin = mocked(signIn);

        render (
            <SubscribeButton />
        )
            
        const subscribeButton = screen.getByText("Subscribe now");

        fireEvent.click(subscribeButton);

        expect(mockedSignin).toHaveBeenCalled();
    });


    it("redirects to posts route when has a subscription", () => {
        const mockedUseSession = mocked(useSession);
        const mockedPush = jest.fn();
        mockedUseSession.mockReturnValueOnce([
            {user: {
                name: "John Doe",
                email: "john.doe@example.com",
                image: "/image.jpg",
            }, 
            activeSubscription: "fake-active-subscription",
            expires: "FakeExpires"},
            false
        ]);

        const mockedUseRouter = mocked(useRouter);
        mockedUseRouter.mockReturnValueOnce({
            push: mockedPush
        } as any);

        render (
            <SubscribeButton />
        )
            
        const subscribeButton = screen.getByText("Subscribe now");

        fireEvent.click(subscribeButton);
        expect(mockedPush).toHaveBeenCalledWith("/posts");
    });


})
