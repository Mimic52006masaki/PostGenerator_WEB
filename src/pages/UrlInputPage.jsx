import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UrlInputPage.module.css";

export default function UrlInputPage() {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [createdPostId, setCreatedPostId] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setCreatedPostId(null);

        const urls = input
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        if (urls.length === 0) {
            setError('URLを1つ以上入力してください');
            return;
        }

        for (const url of urls) {
            try { new URL(url) } catch { setError(`無効なURL形式があります: ${url}`); return; }
        }

        setLoading(true);
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls })
            });
            if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`);
            const data = await res.json();
            if (data.status === 'ok') {
                setSuccess('スクレイピング登録が成功しました!');
                setInput('');
                if (data.posts && data.posts.length > 0) {
                    setCreatedPostId(data.posts[0].id); // ← 修正
                }
            } else {
                setError('スクレイピングに失敗しました。')
            }
        } catch {
            setError('通信エラーが発生しました。');
        } finally { setLoading(false); }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>URL入力画面</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <textarea
                    className={styles.textarea}
                    rows={10}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="1行に1つずつURLを入力してください"
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
                        {createdPostId && (
                            <button
                                className={styles.button}
                                onClick={() => navigate(`/posts/${createdPostId}`)}
                            >
                                詳細ページへ
                            </button>
                        )}
                        <button
                            className={`${styles.button} ${styles.listButton}`}
                            onClick={() => navigate('/posts')}
                        >
                            投稿一覧へ
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
