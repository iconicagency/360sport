'use client';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from './CartProvider';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [qty, setQty] = useState(1);
  const { addToCart, openCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ ...product, quantity: qty });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    openCart();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
      <div className="flex items-center border-2 border-gray-200 rounded-xl h-14 w-full sm:w-auto">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 text-gray-500 hover:text-brand-blue text-xl font-medium transition-colors">-</button>
        <input 
          type="number" 
          value={qty} 
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} 
          className="w-16 text-center font-bold text-lg focus:outline-none" 
        />
        <button onClick={() => setQty(qty + 1)} className="px-5 text-gray-500 hover:text-brand-blue text-xl font-medium transition-colors">+</button>
      </div>
      <button 
        onClick={handleAdd} 
        disabled={isAdded}
        className={`w-full sm:flex-1 text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg uppercase tracking-wider ${isAdded ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-brand-blue hover:bg-brand-dark-blue shadow-brand-blue/30'}`}
      >
        {isAdded ? (
          <>
            <Check className="h-5 w-5" /> Đã Thêm Vào Giỏ
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" /> Thêm Vào Giỏ
          </>
        )}
      </button>
    </div>
  );
}
