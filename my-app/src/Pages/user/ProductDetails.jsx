import { useEffect, useState, useMemo } from "react";
import axiosinstance from "../../api/apiinstances.js";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import WishlistButton from "./Wishlistbutton";
import toast from "react-hot-toast";

function ProductDetails() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const searchQuery = (searchParams.get("search") || "").toLowerCase();

  useEffect(() => {
    axiosinstance.get("/products",{
      withCredentials :true
    })
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

 
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
  if (err.response?.status === 401) {
    toast.error("Please login first");
    navigate("/login");
  } else {
    toast.error("Failed to add to cart");
  }
}
};

  const handleSearch = () => {
    const value = searchText.trim();
    if (!value) return;
    navigate(`/productdetails?search=${value}`);
  };

  const categories = [
    ...new Set(products.map(p => p.category).filter(Boolean))
  ];

const filteredProducts = useMemo(() => {
  let result = [...products];

  if (searchText.trim()) {
    const words = searchText.trim().split(/\s+/);

    result = result.filter((product) => {
      const text = `
        ${product.title ?? ""}
        ${product.description ?? ""}
        ${product.brand ?? ""}
      `.toLowerCase();

      return words.every((word) => text.includes(word.toLowerCase()));
    });
  }

  if (selectedCategory) {
    result = result.filter(p => p.category === selectedCategory);
  }

  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

  return result;
}, [products, searchText, selectedCategory, minPrice, maxPrice]);
  return (
    <div className="h-screen overflow-y-auto bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">

          <div className="flex gap-3 w-full md:w-[40%]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-black outline-none p-3 rounded-xl"
            />
            <button 
              onClick={handleSearch}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
            >
              Search
            </button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 focus:ring-2 focus:ring-black outline-none p-3 rounded-xl w-full md:w-44"
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-gray-300 focus:ring-2 focus:ring-black outline-none p-3 rounded-xl w-full md:w-32"
          />

          <input
            type="text"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 focus:ring-2 focus:ring-black outline-none p-3 rounded-xl w-full md:w-32"
          />

          <button
            onClick={() => {
              setSelectedCategory("");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="bg-black text-white px-5 py-3 rounded-xl font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <div className="relative">
              <Link to={`/productui/${product._id}`}>
                <div className="h-52 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt=""
                    className="h-40 object-contain"
                  />
                </div>
              </Link>
              <div className="absolute top-3 right-3">
                <WishlistButton product={product} />
              </div>
            </div>

            <div className="p-4">
              <p className="font-medium line-clamp-2 min-h-[40px]">
                {product.description}
              </p>
              <p className="text-lg font-bold mt-2">
                ₹{product.price}
              </p>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/productui/${product._id}`}
                  className="flex-1 text-center border py-2 rounded text-sm"
                >
                  View
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-black text-white py-2 rounded text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;