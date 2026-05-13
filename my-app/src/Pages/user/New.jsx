// import React, { useEffect, useState } from 'react'
// import axiosinstance from '../../api/apiinstances.js'

// function New() {

//   const [data, setData] = useState(null)
//   const [adata, setadata] = useState({})

//   useEffect(() => {

//     const fetchData = async () => {
//       try {

//         const response = await axiosinstance.get("/practice/ordrcount")

//         setData(response.data)

//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchData()

//     const fetchpdts=async ()=>{
//         try {
//             const mydata=await axiosinstance.get("/practice/productcount")
//             console.log(mydata)
// setadata(mydata.data)
//         } catch (error) {
// console.error("error detecteeed")
//         }
//     }
//     fetchpdts()

//   }, [])

//   return (
//     <div>
//       <div>
//         <h2>{JSON.stringify(data)}</h2>
//         <h2>{JSON.stringify(adata.price)}</h2>
//       </div>
//     </div>
//   )
// }

// export default New