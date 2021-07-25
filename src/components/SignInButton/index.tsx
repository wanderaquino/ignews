import {FaGithub} from "react-icons/fa";
import {FiX} from "react-icons/fi";

import styles from "./styles.module.scss";


export function SignInButton () {
    const isUserLogged = true;
    
    return (
        <button className={styles.signInButton} type="button">
            <FaGithub color={isUserLogged ? "#84d361" : "#eba417"}/>
            {isUserLogged ? "Wander Aquino da Cruz" : "Login with GitHub"}
            {isUserLogged && <FiX color="#737380" className={styles.closeIcon}/>}
        </button>
    )
}