import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import CopyButton from "../components/CopyButton";
import { TIME_CODES } from "../utils/timeCodes";

import {
    t7_1, t7_2, t8_1, t8_2, t9_1, t9_2,
    t10_1, t10_2, t11_1, t11_2, t12_1, t12_2,
    t13_1, t13_2, t14_1, t14_2, t15_1, t15_2,
    t16_1, t16_2, t17_1, t17_2, t18_1, t18_2,
    t19_1, t19_2, t20_1, t20_2, t21_1, t21_2
} from "../components/code";

const TIME_CODES = {
    "7:00": [t7_1, t7_2], "8:00": [t8_1, t8_2], "9:00": [t9_1, t9_2],
    "10:00": [t10_1, t10_2], "11:00": [t11_1, t11_2], "12:00": [t12_1, t12_2],
    "13:00": [t13_1, t13_2], "14:00": [t14_1, t14_2], "15:00": [t15_1, t15_2],
    "16:00": [t16_1, t16_2], "17:00": [t17_1, t17_2], "18:00": [t18_1, t18_2],
    "19:00": [t19_1, t19_2], "20:00": [t20_1, t20_2], "21:00": [t21_1, t21_2],
};

// 環境変数から API URL を取得（.env.development を参照）
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE}/posts/${id}`);
                if (!res.ok) throw new Error(`投稿取得失敗: ${res.status}`);
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
            const res = await fetch(`${API_BASE}/posts/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`削除に失敗しました: ${res.status}`);
            alert("投稿を削除しました");
            navigate("/posts");
        } catch (err) {
            alert(err.message);
        }
    };

    if (error) return <p className={styles.error}>エラー: {error}</p>;
    if (loading) return <p>読込中...</p>;
    if (!post) return <p>投稿が存在しません</p>;

    // 時間帯に応じたコピー用コード
    const hour = new Date(post.published_at).getHours();
    const timeKey = `${hour}:00`;
    const [code1, code2] = TIME_CODES[timeKey] || [];
    const safeCode1 = typeof code1 === "string" ? code1 : "";
    const safeCode2 = typeof code2 === "string" ? code2 : "";

    return (
        <div className={styles.container}>
            <h1>{post.title}</h1>
            <p>{post.published_at}</p>

            {(safeCode1 || safeCode2) && (
                <div className={styles.buttonGroup} style={{ marginBottom: "20px" }}>
                    {safeCode1 && <CopyButton label={`${timeKey}_1`} content={[safeCode1]} />}
                    {safeCode2 && <CopyButton label={`${timeKey}_2`} content={[safeCode2]} />}
                </div>
            )}

            <div className={styles.buttonGroup}>
                <button
                    onClick={() => {
                        const textToCopy = (post.details || [])
                            .map(d => (typeof d.content === "string" ? d.content : ""))
                            .join("\n\n");
                        navigator.clipboard.writeText(textToCopy);
                        alert("投稿内容をコピーしました");
                    }}
                    className={styles.copyButton}
                >
                    投稿全体コピー
                </button>

                <button onClick={handleDelete} className={styles.deleteButton}>
                    投稿を削除
                </button>

                <button className={styles.backButton} onClick={() => navigate("/posts")}>
                    投稿に戻る
                </button>
            </div>

            <div className={styles.details}>
                {(post.details || []).map(d => (
                    <div
                        key={d.id}
                        dangerouslySetInnerHTML={{ __html: typeof d.content === "string" ? d.content : "" }}
                    />
                ))}
            </div>
        </div>
    );
}
