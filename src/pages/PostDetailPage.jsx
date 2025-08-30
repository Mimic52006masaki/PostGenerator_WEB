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
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
            alert('投稿を削除しました!');
            navigate('/posts');
        } catch {
            alert('削除に失敗しました。');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/posts/${id}`);
            if (!res.ok) throw new Error(`Post HTTPエラー: ${res.status}`);
            const postData = await res.json();
            setPost(postData);

            // details は HTML 部分だけを配列にする
            const detailHtmlArray = postData.details.map(d => d.content);
            setDetails(detailHtmlArray);

        } catch {
            setError('投稿または詳細情報の取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const copyDetails = () => {
        if (details.length > 0) {
            // 各メッセージの間に空行を入れて読みやすくする
            const text = details.join('\n\n');
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

            {/* 投稿内容をHTMLとして表示 */}
            <div className={styles.detailsContainer}>
                {details.map((content, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: content }} />
                ))}
            </div>
        </div>
    );
}
