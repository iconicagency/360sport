import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import { Check, Shield, Truck, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {discount > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                Giảm {discount}%
              </div>
            )}
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover" 
              priority
            />
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-sm text-[#f97316] font-bold uppercase tracking-wider mb-2">{product.category}</div>
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <span className="text-sm text-gray-500">(128 đánh giá)</span>
            </div>
            
            <div className="flex items-end gap-4 mb-8 pb-8 border-b">
              <span className="text-4xl font-bold text-[#f97316]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            
            <div className="prose text-gray-600 mb-8">
              <p className="text-lg leading-relaxed">
                Sản phẩm chính hãng 360 SPORT. Cung cấp năng lượng tức thì, bù khoáng và điện giải hiệu quả cho quá trình tập luyện thể thao cường độ cao.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                  <span className="font-medium">Hàng chính hãng 100%</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                  <span className="font-medium">Giao hàng toàn quốc</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                  <span className="font-medium">Đổi trả trong 7 ngày nếu có lỗi</span>
                </li>
              </ul>
            </div>
            
            <AddToCartButton product={product} />
            
            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-[#f97316] shrink-0" />
                <div>
                  <div className="font-bold text-gray-900 mb-1">Bảo đảm chất lượng</div>
                  <div className="text-sm text-gray-500">Sản phẩm đã được kiểm định an toàn</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="h-8 w-8 text-[#f97316] shrink-0" />
                <div>
                  <div className="font-bold text-gray-900 mb-1">Miễn phí vận chuyển</div>
                  <div className="text-sm text-gray-500">Áp dụng cho đơn hàng từ 500.000đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
