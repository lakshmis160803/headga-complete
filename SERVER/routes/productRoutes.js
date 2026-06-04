import express from "express";
import {
  addProduct,
  getProducts,
  getSingleProduct ,
   updateProduct,
  deleteProduct  
} from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = express.Router();


router.post(
  "/",verifyToken,isAdmin,
  upload.single("image"),
  addProduct
);
router.get("/",getProducts);

router.patch("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

router.get("/:id", getSingleProduct); 

export default router;