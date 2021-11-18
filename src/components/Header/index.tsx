import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import Image from "next/image"
import { ActiveLink } from "../ActiveLink";
import logo from "../../../public/images/logo.svg";

export function Header () {
    

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src={logo}  alt="Logo IgNews" />

                {/* <img src="/images/logo.svg" alt="Logo IgNews"></img> */}
                <nav>
                    <ActiveLink href="/" activeClassName={styles.active}>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active}>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SignInButton />
            </div>
        </header>
    )
}