import { useState } from "react";
import styles from "./Navbar.module.scss";
import { Menu } from "react-feather";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
    const { user, logout } = useAppContext();

    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles["navbar"]}>
            <div className={styles["logo"]}>sonatrio</div>
            <button
                className={styles["hamburger"]}
                onClick={toggleNavbar}
                aria-label="Toggle navigation"
            >
                <Menu size={18} />
            </button>
            <div className={`${styles.links} ${isOpen ? styles["open"] : ""}`}>
                {user ? (
                    <div onClick={logout}>Sign Out</div>
                ) : (
                    <a href="/login">Sign In</a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
