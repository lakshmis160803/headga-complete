// import { Navigate } from "react-router-dom";
// import { useWishlist } from "./Wishlistcontext";

// function UserRoute({ children }) {
//   const { userId, loading } = useWishlist();

//   // 🔥 wait until auth loads
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // 🔥 if not logged in
//   if (!userId) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// export default UserRoute;