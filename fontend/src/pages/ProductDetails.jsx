import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  // Tìm sản phẩm dựa trên ID từ URL
  const product = products.find(p => p.id === parseInt(id));
  
  // State quản lý hình ảnh đang chọn và biến thể
  const [mainImg, setMainImg] = useState(product?.img);
  const [selectedColor, setSelectedColor] = useState(product?.variants.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product?.variants.storage[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="text-center py-20">Sản phẩm không tồn tại!</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Breadcrumbs (Đường dẫn) */}
      <nav className="container mx-auto px-4 py-4 text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Trang chủ</Link> $\rightarrow$ 
        <Link to="/category" className="hover:text-primary">{product.category}</Link> $\rightarrow$ 
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 2. CỘT TRÁI: HÌNH ẢNH */}
        <div className="flex flex-col gap-4">
          <div className="border rounded-xl overflow-hidden bg-gray-50">
            <img 
              src={mainImg} 
              alt={product.name} 
              className="w-full h-auto object-contain max-h-[500px] transition-opacity duration-300" 
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.gallery.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setMainImg(img)}
                className={`border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-all ${mainImg === img ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                <img src={img} alt="thumb" className="w-full h-20 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-primary text-3xl font-bold">{product.price}</span>
            <span className="text-gray-400 line-through text-lg">{product.oldPrice}</span>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">GIẢM 10%</span>
          </div>

          <div className="border-t border-b py-6 space-y-6">
            {/* Chọn Màu Sắc */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">MÀU SẮC: <span className="text-gray-400 font-normal">{selectedColor}</span></label>
              <div className="flex flex-wrap gap-3">
                {product.variants.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs rounded-full border transition-all ${selectedColor === color ? 'border-primary bg-primary text-white' : 'bg-white text-gray-600 hover:border-primary'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Dung Lượng */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">DUNG LƯỢNG: <span className="text-gray-400 font-normal">{selectedStorage}</span></label>
              <div className="flex flex-wrap gap-3">
                {product.variants.storage.map(st => (
                  <button 
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`px-4 py-2 text-xs rounded-full border transition-all ${selectedStorage === st ? 'border-primary bg-primary text-white' : 'bg-white text-gray-600 hover:border-primary'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng & Nút mua */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
                <span className="px-4 py-2 font-medium border-x">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
              </div>
              <button className="flex-1 bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                <ShoppingCart size={20} /> THÊM VÀO GIỎ HÀNG
              </button>
            </div>
          </div>

          {/* Cam kết dịch vụ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="text-primary" size={24} />
              <span>Bảo hành 12 tháng chính hãng</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="text-primary" size={24} />
              <span>Giao hàng nhanh 2h nội thành</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="text-primary" size={24} />
              <span>Đổi trả trong 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tab Nội dung & Đánh giá */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex border-b gap-8 mb-6">
          <button className="pb-3 border-b-2 border-primary font-bold text-gray-800">MÔ TẢ CHI TIẾT</button>
          <button className="pb-3 text-gray-400 hover:text-primary transition-colors">ĐÁNH GIÁ KHÁCH HÀNG (0)</button>
        </div>
        <div className="prose max-w-none text-gray-600 leading-relaxed">
          <p>{product.description}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-3">Thông số kỹ thuật</h4>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between border-b py-1"><span>Màn hình:</span> <span>6.7 inch Super Retina XDR</span></li>
                    <li className="flex justify-between border-b py-1"><span>Chip:</span> <span>Apple A17 Pro (3nm)</span></li>
                    <li className="flex justify-between border-b py-1"><span>RAM:</span> <span>8GB LPDDR5</span></li>
                    <li className="flex justify-between border-b py-1"><span>Pin:</span> <span>4441 mAh, Sạc nhanh 20W</span></li>
                </ul>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-3">Đặc điểm nổi bật</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Khung viền Titanium siêu nhẹ và bền.</li>
                    <li>Cổng sạc USB-C tốc độ truyền tải cao.</li>
                    <li>Nút Action tùy chỉnh linh hoạt.</li>
                    <li>Hệ thống camera Pro 48MP siêu sắc nét.</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
