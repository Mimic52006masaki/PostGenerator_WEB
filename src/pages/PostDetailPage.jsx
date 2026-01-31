import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CopyButton from "../components/CopyButton";
import { TIME_CODES } from "./timeCodes";

// 環境変数から API URL を取得（.env.development を参照）
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

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

    if (error) return <p className="text-red-600">エラー: {error}</p>;
    if (loading) return <p>読込中...</p>;
    if (!post) return <p>投稿が存在しません</p>;

    // 時間帯に応じたコピー用コード
    const hour = new Date(post.published_at).getHours();
    const timeKey = `${hour}:00`;
    const [code1, code2] = TIME_CODES[timeKey] || [];
    const safeCode1 = typeof code1 === "string" ? code1 : "";
    const safeCode2 = typeof code2 === "string" ? code2 : "";

    return (
        <div className="max-w-3xl mx-auto mt-12 p-7 font-sans bg-white bg-opacity-90 rounded-2xl shadow-2xl">
            <h1 className="text-2xl mb-6">{post.title}</h1>
            <p className="mb-4">{post.published_at}</p>


            {(safeCode1 || safeCode2) && (
                <div className="flex gap-2 mb-6 ml-4 justify-start">
                    {safeCode1 && <CopyButton label={`${timeKey}_1`} content={[safeCode1]} />}
                    {safeCode2 && <CopyButton label={`${timeKey}_2`} content={[safeCode2]} />}
                </div>
            )}
            <div className="flex gap-4 m-4">
                <button
                    onClick={() => {
                        const textToCopy = (post.details || [])
                            .map(d => (typeof d.content === "string" ? d.content : ""))
                            .join("\n\n");
                        navigator.clipboard.writeText(textToCopy);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`flex-1 py-3 px-5 shadow-xl ${copied ? 'bg-blue-500' : 'bg-green-500'} text-white text-bold border-2 border-gray-600 rounded-lg cursor-pointer font-medium transition-all hover:${copied ? 'bg-blue-600' : 'bg-green-600'} hover:-translate-y-0.5`}
                >
                    投稿全体コピー
                </button>

                <button onClick={handleDelete} className="flex-1 py-3 px-5 bg-red-500 text-white border-2 border-white rounded-lg cursor-pointer font-medium transition-all hover:bg-red-600 hover:-translate-y-0.5">
                    投稿を削除
                </button>

                <button className="flex-1 py-3 px-5 bg-blue-500 text-white border-2 border-white rounded-lg cursor-pointer font-medium transition-all hover:bg-blue-600 hover:-translate-y-0.5" onClick={() => navigate("/posts")}>
                    投稿に戻る
                </button>
            </div>

            <div>
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
