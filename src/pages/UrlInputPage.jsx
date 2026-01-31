import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            const res = await fetch('http://localhost:3000/api/scrape', {
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
        <div className="max-w-5xl mx-auto mt-16 p-10 text-center bg-white bg-opacity-90 rounded-xl shadow-xl flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">URL入力画面</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-2xl gap-4">
                <input
                    className="w-1/5 h-10 rounded-md border border-gray-300 text-lg text-center"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    disabled={loading}
                />
                <textarea
                    className="p-3.5 border border-gray-300 rounded-lg outline-none w-full min-h-52 text-lg text-gray-800 resize-y transition-all focus:border-blue-500 focus:shadow-lg"
                    rows={10}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="1行に1つずつURLを入力"
                    disabled={loading}
                />
                <button className="px-6 py-3 mt-5 bg-blue-500 text-white border-none rounded-lg text-lg font-semibold cursor-pointer min-w-40 transition-all hover:bg-blue-700 hover:-translate-y-0.5 self-center" type="submit" disabled={loading}>
                    {loading ? '送信中...' : '登録'}
                </button>
            </form>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            {success && (
                <>
                    <p className="text-lg text-green-600 mt-2">{success}</p>
                    <div className="flex gap-3 mt-5 justify-center flex-wrap">
                        {createdPostId && <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold cursor-pointer min-w-30 transition-all hover:bg-blue-700 hover:-translate-y-0.5" onClick={() => navigate(`/posts/${createdPostId}`)}>詳細</button>}
                        <button className="px-5 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-semibold cursor-pointer min-w-30 transition-all hover:bg-gray-600 hover:-translate-y-0.5" onClick={() => navigate('/posts')}>一覧へ</button>
                    </div>
                </>
            )}
        </div>
    );
}
