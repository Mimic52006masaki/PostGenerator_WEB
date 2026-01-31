import { Link } from "react-router-dom"

export default function Header() {
    return (
        <header className="bg-gray-900 text-white p-4 shadow-lg fixed top-0 left-0 w-full z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold transition-colors hover:text-gray-200">
                    PostGenerator
                </Link>
                <nav>
                    <ul className="flex gap-6 list-none">
                        <li>
                            <Link to="/posts" className="transition-colors hover:text-gray-200 px-3 py-2 rounded-md">
                            投稿一覧
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="transition-colors hover:text-gray-200 px-3 py-2 rounded-md">
                                新規作成
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
