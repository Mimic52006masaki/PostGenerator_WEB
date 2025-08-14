import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom'
import './App.css'
import UrlInputPage from './pages/UrlInputPage'
import PostsListPage from './pages/PostsListPage'
import PostDetailPage from './pages/PostDetailPage'
import { Toaster } from 'react-hot-toast';
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<UrlInputPage />} />
          <Route path='/posts' element={<PostsListPage />} />
          <Route path='/posts/:id' element={<PostDetailPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster position='top-right' />
    </>
  );
}

