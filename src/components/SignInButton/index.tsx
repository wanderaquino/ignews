import {FaGithub} from "react-icons/fa";
import {FiX} from "react-icons/fi";
import styles from "./styles.module.scss";
import {signOut, signIn, useSession, signin, signout} from "next-auth/client";

export function SignInButton () {
    const [session] = useSession();
    
    return (
        <button 
            className={styles.signInButton} 
            type="button" 
            onClick={!session ? () => signin("github"): () => signout()}>
            <FaGithub color={session ? "#84d361" : "#eba417"}/>
            {session ? session.user.name : "SignIn with GitHub"}
            {session && <FiX color="#737380" className={styles.closeIcon}/>}
        </button>
    )
}