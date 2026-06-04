import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosinstance from "../../api/apiinstances";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) formData.append("avatar", file);

      const res = await axiosinstance.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response:", res.data);

   const updatedUser = {
  id: res.data.user.id,
  name: res.data.user.name,
  role: res.data.user.role,
  avatar: res.data.user.avatar,
};

console.log("Updated User:", updatedUser);

setUser(updatedUser);
      
      toast.success("Profile updated!");
    }catch (err) {
  console.log(err);
  console.log(err.response?.data);

  toast.error(
    err.response?.data?.message ||
    err.response?.data?.msg ||
    "Failed to update profile."
  );
}finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="w-[400px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-white">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            {preview ? (
              <img src={preview} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-white/30" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-white/20 hover:bg-white/30 rounded-full p-1 cursor-pointer border border-white/30">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              ✏️
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-full font-semibold bg-black/40 hover:bg-black/60 transition-all"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;