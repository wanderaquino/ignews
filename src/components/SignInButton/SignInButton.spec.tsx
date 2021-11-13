import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";
import { SignInButton } from ".";

jest.mock("next-auth/client");


describe("Signin component", () => {

    it("renders correctly when user is not authenticated", () => {
        const mockedUseSession = mocked(useSession);
        mockedUseSession.mockReturnValueOnce([null, false]);
        const {getByText} = render (
            <SignInButton />
        )
    
        expect(getByText("SignIn with GitHub")).toBeInTheDocument();
    });

    it("renders correctly when user is authenticated", () => {
        const mockedUseSession = mocked(useSession);
        mockedUseSession.mockReturnValueOnce([{
            user: {
                name: "John Doe",
                email: "john.doe@example.com",
                image: "image.jpg"
            },
            expires: "fakeExpires"
        }, false]);
        const {getByText} = render (
            <SignInButton />
        )
    
        expect(getByText("John Doe")).toBeInTheDocument();
    });
})
