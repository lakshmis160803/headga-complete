import { useEffect, useState } from "react";
import axiosinstance from "../../api/apiinstances.js";
import { Plus, Edit2, Trash2, Package, X, Image as ImageIcon, Search } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "", price: "", stock: "", description: "", category: "", image: null
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosinstance.get("/products");
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosinstance.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((i) => i._id !== id));
    } catch (err) { console.error(err); }
  };

 const saveProduct = async () => {
  try {
    const formData = new FormData();
    formData.append("title", editing.title);
    formData.append("price", editing.price);
    formData.append("stock", editing.stock);
    formData.append("category", editing.category);
    formData.append("description", editing.description);
    if (editImage) formData.append("image", editImage);

    await axiosinstance.patch(`/products/${editing._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setEditing(null);
    setEditImage(null);
    fetchProducts();
  } catch (err) { console.error(err); }
};

  const addProduct = async () => {
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
      await axiosinstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewProduct({ title: "", price: "", stock: "", description: "", category: "", image: null });
      setShowAddForm(false);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-800 font-sans">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Product Inventory</h1>
          <p className="text-slate-500 mt-1">Manage your catalog, stock levels, and pricing.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? "Close Form" : "Add New Product"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ADD PRODUCT FORM */}
        {showAddForm && (
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-8 transition-all animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-500" /> Product Details
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                <FormInput label="Product Title" placeholder="e.g. Premium Wireless Headphones" value={newProduct.title} onChange={(val) => setNewProduct({ ...newProduct, title: val })} />
                <FormInput label="Category" placeholder="Electronics" value={newProduct.category} onChange={(val) => setNewProduct({ ...newProduct, category: val })} />
                <FormInput label="Price (₹)" type="number" placeholder="0.00" value={newProduct.price} onChange={(val) => setNewProduct({ ...newProduct, price: val })} />
                <FormInput label="Initial Stock" type="number" placeholder="100" value={newProduct.stock} onChange={(val) => setNewProduct({ ...newProduct, stock: val })} />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Product Image</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 transition-colors h-full min-h-[120px] flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
                  {newProduct.image ? (
                    <img src={URL.createObjectURL(newProduct.image)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto text-slate-400 mb-2" size={24} />
                      <span className="text-xs text-slate-500">Click to upload</span>
                    </div>
                  )}
                  <input type="file" onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell customers about this product..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl p-3 outline-none transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={addProduct} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100">
                Publish Product
              </button>
            </div>
          </div>
        )}

       
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{p.title}</p>
                          <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className="text-sm font-medium">{p.stock} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setEditing(p); setEditImage(null); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Edit Product</h2>
      <div className="space-y-4">
        <FormInput label="Title" value={editing.title} onChange={(val) => setEditing({ ...editing, title: val })} />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Price" type="number" value={editing.price} onChange={(val) => setEditing({ ...editing, price: +val })} />
          <FormInput label="Stock" type="number" value={editing.stock} onChange={(val) => setEditing({ ...editing, stock: +val })} />
        </div>
        <FormInput label="Category" value={editing.category} onChange={(val) => setEditing({ ...editing, category: val })} />
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Description</label>
          <textarea
            rows={3}
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Product Image</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 transition-colors h-40 flex items-center justify-center bg-slate-50 overflow-hidden">
            <img
              src={editImage ? URL.createObjectURL(editImage) : editing.image}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <ImageIcon size={16} /> Change Image
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          {editImage && (
            <p className="text-xs text-blue-600 mt-1">New image: {editImage.name}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => { setEditing(null); setEditImage(null); }} className="flex-1 px-5 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
          Cancel
        </button>
        <button onClick={saveProduct} className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function FormInput({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl p-3 outline-none transition-all text-sm"
      />
    </div>
  );
}