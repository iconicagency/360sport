'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from './CartProvider';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    openCart();
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0"></Link>
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Quick Add Button Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button 
            onClick={handleAddToCart} 
            disabled={isAdded}
            className={`w-full text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transition-colors pointer-events-auto ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-[#f97316] hover:bg-orange-600'}`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>Đã thêm</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Thêm vào giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow relative z-10 pointer-events-none">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-medium">
          {product.category}
        </div>
        <Link href={`/products/${product.id}`} className="block mb-3 flex-grow pointer-events-auto">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-[#f97316] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-base text-[#f97316]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
