import { useState } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
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
                ☰
            </button>
            <div className={`${styles.links} ${isOpen ? styles.open : ""}`}>
                <a href="/pricing">Pricing</a>
                <a href="/profile">Profile</a>
            </div>
        </nav>
    );
};

export default Navbar;
