import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';

import Category from './pages/Category';

import About from './pages/About';
import Products from './pages/Products';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Reviews from './pages/Reviews';
import Wishlist from './pages/Wishlist';
import Faq from './pages/Faq';
import Warranty from './pages/Warranty';
import Preorder from './pages/Preorder';
import Contact from './pages/Contact';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/:id" element={<Category />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Menu tĩnh từ Header */}
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/preorder" element={<Preorder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
        </Routes>

      </MainLayout>
    </Router>
  );
}

export default App;
