import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UrlInputPage.module.css";

export default function UrlInputPage() {
    const [input, setInput] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [createdPostId, setCreatedPostId] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setCreatedPostId(null);

        const urls = input.split('\n').map(u => u.trim()).filter(Boolean);
        if (!urls.length) return setError('URLを1つ以上入力してください');

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls, date })
            });

            const data = await res.json();

            // HTTPステータスが 2xx 以外ならエラー
            if (!res.ok) {
                setError(`サーバーエラー: ${res.status}`);
                return;
            }

            // 個別URLのエラーがある場合
            if (data.errors && data.errors.length > 0) {
                setError(`一部URLでエラーが発生しました: ${data.errors.map(e => e.url).join(', ')}`);
                return;
            }

            // 成功メッセージ
            setSuccess('スクレイピング登録が成功しました!');
            if (data.post_ids && data.post_ids.length) {
                setCreatedPostId(data.post_ids[0]);
            }

        } catch (err) {
            console.error(err);
            setError(`通信エラーが発生しました: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>URL入力画面</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    disabled={loading}
                />
                <textarea
                    className={styles.textarea}
                    rows={10}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="1行に1つずつURLを入力"
                    disabled={loading}
                />
                <button className={styles.submitButton} type="submit" disabled={loading}>
                    {loading ? '送信中...' : '登録'}
                </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            {success && (
                <>
                    <p className={styles.success}>{success}</p>
                    <div className={styles.buttonGroup}>
                        {createdPostId && <button onClick={() => navigate(`/posts/${createdPostId}`)}>詳細</button>}
                        <button onClick={() => navigate('/posts')}>一覧へ</button>
                    </div>
                </>
            )}
        </div>
    );
}
