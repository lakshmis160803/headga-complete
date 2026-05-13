// import axios from "axios";

// const CART_URL = "http://localhost:3001/cart";

// export const AddtoCart = async (product) => {
//   const userId = localStorage.getItem("userId");
//   if (!userId) return alert("Please login first");

  
//   const res = await axios.get(CART_URL, {
//     params: {
//       userId,
//       productId: product._id
//     }
//   });

//   if (res.data.length > 0) {
//     const item = res.data[0];

//     return axios.patch(`${CART_URL}/${item.id}`, {
//       quantity: item.quantity + 1
//     });
//   }

//   return axios.post(CART_URL, {
//     userId,
//     productId: product._id,
//     title: product.title,
//     price: product.price,
//     image: product.image,
//      description: product.description,
//     quantity: 1
//   });
// };
