import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostsListPage.module.css";

export default function PostsListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch {
            alert('投稿一覧取得失敗');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('削除しますか？')) return;
        await fetch(`http://localhost:3001/api/posts/${id}`, { method: 'DELETE' });
        fetchPosts();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>投稿一覧</h1>
            {loading ? <p>読込中...</p> : (
                <ul className={styles.list}>
                    {posts.map(p => (
                        <li key={p.id} className={styles.listItem}>
                            <span onClick={() => navigate(`/posts/${p.id}`)} className={styles.postTitle}>
                                {p.title}
                            </span>
                            <span className={styles.postDate}>{p.published_at}</span>
                            <div className={styles.buttonGroup}>
                                <button className={styles.detailButton} onClick={() => navigate(`/posts/${p.id}`)}>詳細</button>
                                <button className={styles.deleteButton} onClick={() => handleDelete(p.id)}>削除</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button className={styles.newButton} onClick={() => navigate('/')}>新規登録</button>
        </div>
    );
}
