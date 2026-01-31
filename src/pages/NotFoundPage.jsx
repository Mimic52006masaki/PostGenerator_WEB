import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="text-center mt-20 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg max-w-md mx-auto">
            <h1 className="text-2xl text-red-600 mb-4">404 - ページが見つかりません</h1>
            <p className="text-lg text-gray-700 mb-8">
                URLが間違っているか、ページは存在しません。
            </p>
            <button
                className="py-2 px-6 text-lg border-none rounded bg-blue-500 text-white cursor-pointer transition-colors hover:bg-blue-700"
                onClick={() => navigate('/')}
            >
                トップに戻る
            </button>
        </div>
    );
}
