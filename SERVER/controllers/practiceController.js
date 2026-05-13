// import express from 'express'
// import Products from '../models/Product.js'
// import Order from '../models/Order.js'



// export const productcounts=async (req,res)=>{
// try {
  
//     const data = await Products.find()
//     const price=data.reduce(
//         (acc,item)=>
//         acc+(item.price || 0),
//         0)

// res.json({price})
// }
//  catch (error) {
//     res.json({"msg":"not receivedd"})
// }
// }
//  export const orderscount=async(req,res)=>{
//     const ordrdata=await Order.find()
//     const totalAmount=ordrdata.reduce((sum,o)=>sum+(o.totalAmount||0),0)
//     res.json(totalAmount)
//  }
