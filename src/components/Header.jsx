import { Link } from "react-router-dom"
import styles from "./Header.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    PostGenerator
                </Link>
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <Link to="/posts" className={styles.navLink}>
                            投稿一覧
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className={styles.navLink}>
                                新規作成
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
