import React, { useState } from "react";
import styles from "./SideNavbar.module.scss";
import {
    Home,
    Settings,
    User,
    LogIn,
    Sidebar,
    LogOut,
} from "react-feather";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

const SideNavbar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleNavbar = () => setIsCollapsed(!isCollapsed);

    const { user, logout } = useAppContext();

    return (
        <div
            className={`${styles.sidebar} ${
                isCollapsed ? styles.collapsed : ""
            }`}
        >
            <ul className={styles.navList}>
                <li className={styles.navItem} onClick={toggleNavbar}>
                    <Sidebar size={20} />
                </li>
                <Link className={styles.navItem} href="/">
                    <Home size={20} />
                    {!isCollapsed && <span>Home</span>}
                </Link>
                <li className={styles.navItem}>
                    <User size={20} />
                    {!isCollapsed && <span>Profile</span>}
                </li>
                <li className={styles.navItem}>
                    <Settings size={20} />
                    {!isCollapsed && <span>Settings</span>}
                </li>

                {user ? (
                    <li className={styles.navItem} onClick={logout}>
                        <LogOut size={20} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </li>
                ) : (
                    <Link className={styles.navItem} href="/login">
                        <LogIn size={20} />
                        {!isCollapsed && <span>Login</span>}
                    </Link>
                )}
            </ul>
        </div>
    );
};

export default SideNavbar;
