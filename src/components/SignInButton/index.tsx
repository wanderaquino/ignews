import {FaGithub} from "react-icons/fa";
import {FiX} from "react-icons/fi";
import styles from "./styles.module.scss";
import {signIn, useSession} from "next-auth/client";

export function SignInButton () {
    const [session] = useSession();
    
    return (
        <button className={styles.signInButton} type="button" onClick={() => signIn("github")}>
            <FaGithub color={session ? "#84d361" : "#eba417"}/>
            {session ? "Wander Aquino da Cruz" : "Login with GitHub"}
            {session && <FiX color="#737380" className={styles.closeIcon}/>}
        </button>
    )
}