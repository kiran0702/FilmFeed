import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { apiUpdateProfile } from "../../api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";

const EditProfileModal = ({ user, onClose }) => {
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setSelectedPreset("");
    }
  };

  const generateRandomAvatar = (type) => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const url = `https://avatar.iran.liara.run/public/${type}?username=${randomNumber}`;
    setPreview(url);
    setSelectedPreset(url);
    setFile(null); // Clear custom file if any
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      
      // If a preset avatar URL is selected, we send it as a regular field
      if (selectedPreset) {
        formData.append("avatarUrl", selectedPreset);
      } else if (file) {
        formData.append("avatar", file);
      }
      
      const updatedUser = await apiUpdateProfile(formData);
      dispatch(setUser(updatedUser));
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-lg overflow-hidden border border-white/10 shadow-2xl animate-fade-in relative z-[101]">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
              <img src={preview || `https://ui-avatars.com/api/?name=${user?.name}`} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800" />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold">Upload</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 transition" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows="3" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 transition resize-none"></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-white hover:bg-white/5 transition font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditProfileModal;
