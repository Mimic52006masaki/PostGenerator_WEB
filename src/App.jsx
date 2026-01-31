import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom'
import UrlInputPage from './pages/UrlInputPage'
import PostsListPage from './pages/PostsListPage'
import PostDetailPage from './pages/PostDetailPage'
import { Toaster } from 'react-hot-toast';
import NotFoundPage from './pages/NotFoundPage'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-[url('/pksn85s24058.jpg')] bg-cover bg-top bg-fixed bg-opacity-20 pt-16">
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<UrlInputPage />} />
          <Route path='/posts' element={<PostsListPage />} />
          <Route path='/posts/:id' element={<PostDetailPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster position='top-right' />
    </div>
  );
}

