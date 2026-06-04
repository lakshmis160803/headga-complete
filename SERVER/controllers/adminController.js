

import User from "../models/user.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// export const getAdminStats1 = async (req, res) => {

//   try {

//     const [
//       userCount,
//       orderCount,
//       productCount,
//       revenueResult,
//       recentOrders
//  ] = await Promise.all([

//       User.countDocuments(),

//       Order.countDocuments(),

//       Product.countDocuments(),

//       Order.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalRevenue: {
//               $sum: "$totalAmount"
//             }
//           }
//         }
//       ]),

//       Order.find()
//         .sort({ createdAt: -1 })
//         .limit(5)

//     ]);

//     res.json({

//       users: userCount,

//       orders: orderCount,

//       products: productCount,

//       totalRevenue:
//         revenueResult[0]?.totalRevenue || 0,

//       orders: recentOrders

//     });

//   } catch (err) {

//     res.status(500).json({
//       error: err.message
//     });
//   }
// };

export const getAdminStats=async(req,res)=>{
  const [userCount,orderCount,productCount,revenueResult, recentOrders]=await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    
    Order.aggregate([{$group:{_id:null,
      totalRevenue:{$sum:"$totalAmount"}
    }}]),Order.find()
        .sort({ createdAt: -1 })
       

  ])
  res.json({
    users:userCount,
    orders:orderCount,
    products:productCount,
    totalRevenue:revenueResult[0]?.totalRevenue||0,
     orders: recentOrders

  })
}
export const getUsers = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    const users = await User.find()
      .select("-password");

    res.json(users);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const blockUnblockUser = async (
  req,
  res
) => {

  try {



    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json(user);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const deleteUser = async (
  req,
  res
) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json({
      msg: "User deleted",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};