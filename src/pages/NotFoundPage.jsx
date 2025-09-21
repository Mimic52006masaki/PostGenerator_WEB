import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404 - ページが見つかりません</h1>
            <p className={styles.message}>
                URLが間違っているか、ページは存在しません。
            </p>
            <button
                className={styles.backButton}
                onClick={() => navigate('/')}
            >
                トップに戻る
            </button>
        </div>
    );
}
