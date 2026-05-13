import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <>
     
      <Navbar />

      
      <section className="relative h-screen bg-gradient-to-br from-[#fff7e6] via-[#fff1cc] to-[#ffe8b3] overflow-y-auto">
       
        <div className="absolute top-20 left-20 w-40 h-40 bg-black/5 rounded-full animate-floatSlow"></div>
        <div className="absolute bottom-32 right-24 w-56 h-56 bg-black/5 rounded-full animate-floatFast"></div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 animate-fadeInUp">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Feel the <span className="text-black">Sound</span>
            </h1>

            <p className="text-lg text-gray-700 max-w-md">
              Premium wireless headphones with deep bass, noise cancellation,
              and all-day comfort.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/productdetails")}
                className="px-7 py-3 bg-black text-white rounded-full hover:scale-105 transition"
              >
                Shop Now
              </button>

              
            </div>
          </div>

          
          <div className="relative flex justify-center animate-fadeIn">
            <img
              src="https://i.pinimg.com/originals/78/72/45/78724592d143707a049bf3b341a0b50a.png"
              alt="Headphones"
              className="w-[420px] drop-shadow-2xl animate-floatHeadphone"
            />          

           
            <div className="absolute inset-0 bg-black/10 blur-3xl rounded-full -z-10"></div>
          </div>
        </div>


<footer className="bg-black text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
    
   
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold text-white">HEADGA</h2>
      <p className="text-sm text-gray-400">
        Premium wireless headphones engineered for immersive sound,
        deep bass, and everyday comfort.
      </p>
    </div>

    <div>
      <h3 className="text-white font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white cursor-pointer">Home</li>
        <li
          onClick={() => navigate("/productdetails")}
          className="hover:text-white cursor-pointer"
        >
          Products
        </li>
        <li
          onClick={() => navigate("/cart")}
          className="hover:text-white cursor-pointer"
        >
         🛒
        </li>
        <li
          onClick={() => navigate("/wishlist")}
          className="hover:text-white cursor-pointer"
        >
          ❤️
        </li>
      </ul>
    </div>

    
    <div>
      <h3 className="text-white font-semibold mb-4">Support</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white cursor-pointer">Help Center</li>
        <li className="hover:text-white cursor-pointer">Returns</li>
        <li className="hover:text-white cursor-pointer">Warranty</li>
        <li className="hover:text-white cursor-pointer">Privacy Policy</li>
      </ul>
    </div>

    <div className="space-y-4">
      <h3 className="text-white font-semibold">Stay Updated</h3>
      <p className="text-sm text-gray-400">
        Subscribe for product updates and exclusive offers.
      </p>
      <div className="flex">
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-4 py-2 rounded-l-md text-black focus:outline-none"
        />
        
      </div>
    </div>
  </div>

  <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} HEADGA.All rights reserved.
  </div>
</footer>
     

        
      </section>
         
    </>
  );
}

export default Home;
