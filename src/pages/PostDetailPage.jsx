import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";

export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm('本当に削除しますか？')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
            alert('投稿を削除しました!');
            navigate('/posts');
        } catch {
            alert('削除に失敗しました。');
        }
    };

    // Post と detail をまとめて取得
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // post の取得
            const postRes = await fetch(`http://localhost:3000/api/posts/${id}`);
            if (!postRes.ok) throw new Error(`Post HTTPエラー: ${postRes.status}`);
            const postData = await postRes.json();
            setPost(postData);

            // detail の取得
            // detail の取得部分
            const detailRes = await fetch(`http://localhost:3000/api/posts/${id}/details`);
            if (!detailRes.ok) throw new Error(`Detail HTTPエラー: ${detailRes.status}`);
            const detailData = await detailRes.json();
            setDetails(detailData);
        } catch {
            setError('投稿または詳細情報の取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const copyDetails = () => {
        if (details.length > 0) {
            const text = details.join('\n'); // 文字列の配列をまとめる
            navigator.clipboard.writeText(text)
                .then(() => alert('Detail 内容をコピーしました！'))
                .catch(() => alert('コピーに失敗しました'));
        }
    };


    if (loading) return <p>読込中...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>{post?.title}</h1>

            <div className={styles.buttonGroup}>
                <button className={styles.copyButton} onClick={copyDetails}>
                    コピー
                </button>
                <button className={styles.deleteButton} onClick={handleDelete}>
                    投稿を削除
                </button>
                <button className={styles.backButton} onClick={() => navigate('/posts')}>
                    投稿一覧に戻る
                </button>
            </div>
        </div>
    );
}
