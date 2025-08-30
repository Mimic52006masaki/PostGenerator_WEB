import { useEffect, useState } from "react";
import styles from "./PostsListPage.module.css";
import { useNavigate } from "react-router-dom";

export default function PostsListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/posts'); // ← API統一
            if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
            const data = await res.json();
            setPosts(data); // ← ソート処理削除、バックエンド順序に合わせる
        } catch {
            setError('投稿一覧の取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('本当に削除しますか？')) return;
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
            await res.json();
            fetchPosts();
        } catch {
            alert('削除に失敗しました。');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>投稿一覧画面</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {loading ? (
                <p style={{ textAlign: 'center' }}>読込中...</p>
            ) : (
                <ul className={styles.list}>
                    {posts.length === 0 ? (
                        <li style={{ textAlign: 'center' }}>投稿がありません</li>
                    ) : (
                        posts.map(post => (
                            <li key={post.id} className={styles.listItem}>
                                <span
                                    className={styles.postTitle}
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') navigate(`/posts/${post.id}`);
                                    }}
                                >
                                    {post.title}
                                </span>
                                <div className={styles.buttonGroup}>
                                    <button
                                        className={`${styles.button} ${styles.detailButton}`}
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                    >
                                        詳細
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.deleteButton}`}
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        削除
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
            <button className={styles.newButton} onClick={() => navigate('/')}>
                新規登録
            </button>
        </div>
    );
}
