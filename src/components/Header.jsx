import { Link, NavLink } from "react-router-dom"
import styles from "./Header.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    PostGenerator2
                </Link>
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <NavLink
                                to="/posts"
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                            >
                                投稿一覧
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                            >
                                新規作成
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
