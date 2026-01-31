import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostsListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/posts');
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
        await fetch(`http://localhost:3000/api/posts/${id}`, { method: 'DELETE' });
        fetchPosts();
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 p-20 bg-white bg-opacity-60 rounded-lg shadow-lg">
            <h1 className="text-2xl mb-8 text-gray-800 border-b border-gray-300">投稿一覧</h1>
            {loading ? <p className="text-center">読込中...</p> : (
                <ul className="list-none p-0 m-0">
                    {posts.map(p => (
                        <li key={p.id} className="flex flex-col p-7 rounded-md mb-5 bg-green-100 shadow-md transition-all duration-200 hover:scale-103 hover:-translate-y-0.5">
                            <span onClick={() => navigate(`/posts/${p.id}`)} className="text-left cursor-pointer font-bold mb-6">
                                {p.title}
                            </span>
                            <span className="mb-4 text-sm text-gray-600">{p.published_at}</span>
                            <div className="flex gap-5 w-full">
                                <button className="flex-1 py-2 px-2 bg-cyan-500 text-white border-none rounded-md cursor-pointer text-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl" onClick={() => navigate(`/posts/${p.id}`)}>詳細</button>
                                <button className="flex-1 py-2 px-2 bg-red-500 text-white border-none rounded-md cursor-pointer text-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl" onClick={() => handleDelete(p.id)}>削除</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button className="mt-4 bg-green-500 text-white py-2 px-6 border-none rounded-md cursor-pointer text-lg block w-full max-w-36 mx-auto font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl" onClick={() => navigate('/')}>新規登録</button>
        </div>
    );
}
