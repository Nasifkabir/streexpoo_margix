"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product, settings }: { product: any; settings: any }) {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const cartItem = cart.find(item => item._id === product._id);
  const quantityInCart = cartItem?.quantity || 0;
  const remainingStock = product.stockQuantity - quantityInCart;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (remainingStock > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        sellingPrice: product.sellingPrice,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
      });
      showToast(`${product.name} added to cart`);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (remainingStock > 0) {
      updateQuantity(product._id, quantityInCart + 1);
      showToast(`${product.name} quantity increased`);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantityInCart > 1) {
      updateQuantity(product._id, quantityInCart - 1);
      showToast(`${product.name} quantity reduced`);
    } else {
      removeFromCart(product._id);
      showToast(`${product.name} removed from cart`);
    }
  };

  return (
    <div className="group cursor-pointer font-outfit" onClick={handleAddToCart}>
      <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] mb-4 overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 font-black text-3xl uppercase tracking-tighter font-bebas">
            {product.category}
          </div>
        )}
        
        {product.stockQuantity === 0 ? (
          <div className="absolute top-6 right-6 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest font-bebas">SOLD OUT</div>
        ) : (
          <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest font-bebas">
            {remainingStock} LEFT
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6 md:pb-8 px-4 md:px-8">
          {quantityInCart > 0 ? (
            <div className="w-full flex items-center justify-between bg-white rounded-2xl p-2 shadow-xl translate-y-0 md:translate-y-4 group-hover:translate-y-0 duration-300">
              <button 
                onClick={handleDecrement}
                className="h-10 w-10 flex items-center justify-center bg-zinc-100 rounded-xl hover:bg-zinc-200 text-zinc-900 transition-colors font-black text-lg cursor-pointer"
              >
                -
              </button>
              <span className="font-bebas text-xl text-zinc-900">{quantityInCart}</span>
              <button 
                onClick={handleIncrement}
                disabled={remainingStock <= 0}
                className="h-10 w-10 flex items-center justify-center bg-[#0a192f] rounded-xl hover:bg-blue-600 text-white transition-colors font-black text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="w-full bg-white/90 backdrop-blur-md md:bg-white text-zinc-900 font-black text-xs md:text-base tracking-[0.2em] py-4 md:py-5 rounded-2xl hover:bg-[#0a192f] hover:text-white transition-all translate-y-0 md:translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl font-bebas disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center border border-white/20"
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
      <div className="px-2 py-2">
        <h3 className="font-black text-sm md:text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-wider font-bebas leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-1">
          <p className="text-zinc-500 dark:text-zinc-400 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em]">{product.category}</p>
          <p className="font-black text-base md:text-xl text-blue-600 font-outfit">
            {settings.currencySymbol}{product.sellingPrice}
          </p>
        </div>
      </div>
    </div>
  );
}
