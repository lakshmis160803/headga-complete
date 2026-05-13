import axiosinstance from "../../api/apiinstances.js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Productui() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
      axiosinstance.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

const addToCart = async (product) => {
  try {
    await axiosinstance.post(
      "/cart",
      {
        productId: product._id.toString()
      },
      {
        withCredentials: true  
      }
    );
    toast.success("Item added to cart");
  } catch (err) {
    console.error("Cart error:", err.response?.data || err.message);
    toast.error("Failed to add to cart");
  }
};

const buyNow = async () => {
  try {
    await addToCart(product);  
    navigate("/payment", {
      state: {
        cartItems: [{ product: product, quantity: 1 }],
        totalAmount: product.price
      }
    });
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div>
     <Navbar/>
     
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        
        <div className="bg-gray-100 flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-80 object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>

        
        <div className="p-8 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {product.title}
          </h1>

          <p className="text-sm uppercase tracking-wide text-gray-500">
            Brand: <span className="text-gray-800 font-medium">{product.brand}</span>
          </p>

          <p className="text-3xl font-bold text-green-600">
            ₹{product.price}
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 flex gap-4">
            <button onClick={()=>{addToCart(product)
           
            }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
            >
              Add to Cart
            </button>


            

          <button
  onClick={buyNow}
  className="flex-1 border border-gray-300 hover:border-gray-400 py-3 rounded-lg font-medium transition"
>
  Buy Now
</button>

          </div>
        </div>

      </div>
    </div>
    </div>
  );
}

export default Productui;
