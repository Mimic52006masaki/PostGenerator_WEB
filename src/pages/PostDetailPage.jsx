import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PostDetailPage.module.css";

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/posts/${id}`);
                if (!res.ok) throw new Error('投稿取得失敗');
                const data = await res.json();
                setPost(data);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("削除に失敗しました");
            alert("投稿を削除しました");
            navigate("/posts");
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>読込中...</p>;
    if (!post) return <p>投稿が存在しません</p>;

    return (
        <div className={styles.container}>
            <h1>{post.title}</h1>
            <p>{post.published_at}</p>
            <div className={styles.buttonGroup}>
                {/* クリップボードに title + 詳細HTMLをコピー */}
                <button
                    onClick={() => {
                        const textToCopy = post.details.map(d => d.content).join("\n\n");
                        navigator.clipboard.writeText(textToCopy);
                        alert("投稿内容をコピーしました");
                    }}
                    className={styles.copyButton}
                >
                    コピー
                </button>

                <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                >
                    投稿を削除
                </button>

                <button
                    className={styles.backButton}
                    onClick={() => navigate("/posts")}
                >
                    投稿に戻る
                </button>
            </div>

            <div className={styles.details}>
                {post.details.map(d => (
                    <div key={d.id} dangerouslySetInnerHTML={{ __html: d.content }} />
                ))}
            </div>
        </div>
    );
}
