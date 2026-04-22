import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, MapPin, Calendar, Mail, User as UserIcon, Edit2, Check, X, Github, Linkedin, Globe, FileText, Loader2 } from "lucide-react";

import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    yearOfStudy: "",
    address: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "",
        yearOfStudy: user.yearOfStudy || "",
        address: user.address || "",
        bio: user.bio || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "",
        yearOfStudy: user.yearOfStudy || "",
        address: user.address || "",
        bio: user.bio || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        website: user.website || "",
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold sm:text-3xl text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your personal information, links, and academic details.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            <Edit2 size={14} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card (Left Column) */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 mb-4 border-4 border-white shadow-sm">
              <UserIcon size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role} Account</p>
            
            {user?.bio && !isEditing && (
              <p className="mt-4 text-sm text-gray-600 italic">"{user.bio}"</p>
            )}
          </div>

          {!isEditing && (user?.github || user?.linkedin || user?.website) && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-center">Social Links</h3>
              <div className="flex items-center justify-center gap-4">
                {user.github && (
                  <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`} target="_blank" rel="noreferrer" 
                    className="p-2.5 bg-gray-50 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition" title="GitHub">
                    <Github size={20} />
                  </a>
                )}
                {user.linkedin && (
                  <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noreferrer" 
                    className="p-2.5 bg-blue-50 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition" title="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                )}
                {user.website && (
                  <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noreferrer" 
                    className="p-2.5 bg-green-50 rounded-full text-green-600 hover:text-green-700 hover:bg-green-100 transition" title="Website">
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Details / Edit Form (Right Column) */}
        <div className="col-span-1 lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Basic Info</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">Full Name</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Bio / Headline</label>
                    <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={2}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" placeholder="A brief description of yourself..." />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Social Profiles</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">GitHub URL</label>
                    <input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} placeholder="github.com/username"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">LinkedIn URL</label>
                    <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="linkedin.com/in/username"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">Personal Website</label>
                    <input value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="yourwebsite.com"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Academic Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">College / University</label>
                    <input value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">Year of Study</label>
                    <input value={formData.yearOfStudy} onChange={e => setFormData({ ...formData, yearOfStudy: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Location / Address</label>
                    <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes
                </button>
                <button type="button" onClick={cancelEdit} disabled={loading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><UserIcon size={14} /> Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{user?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><Mail size={14} /> Email Address</p>
                    <p className="text-sm font-medium text-gray-900">{user?.email || "Not provided"}</p>
                  </div>
                  {user?.bio && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><FileText size={14} /> Bio</p>
                      <p className="text-sm font-medium text-gray-900">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Academic Details</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><GraduationCap size={14} /> College / University</p>
                    <p className="text-sm font-medium text-gray-900">{user?.college || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><Calendar size={14} /> Year of Study</p>
                    <p className="text-sm font-medium text-gray-900">{user?.yearOfStudy || "Not provided"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><MapPin size={14} /> Address</p>
                    <p className="text-sm font-medium text-gray-900">{user?.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
