import {render} from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/"
            }
        }
    }
});


describe("ActiveLink component", () => {

    it("renders correctly", () => {
        const {getByText} = render (
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(getByText("Home")).toBeInTheDocument;
    });
    
    it("adds active classname to activeLink", () => {
        const {getByText, debug} = render (
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(getByText("Home").classList.contains("active")).toBe(true);
    });

})
