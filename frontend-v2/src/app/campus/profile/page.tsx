"use client";

import { useEffect, useState } from "react";
import { campusAPI } from "@/config/api";
import { Save, GraduationCap, Upload } from "lucide-react";

export default function CampusProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [universityId, setUniversityId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    domain: "",
    website: "",
    description: "",
    location: "",
    tier: "",
    establishedYear: "",
  });

  useEffect(() => {
    fetchUniversity();
  }, []);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      const res = await campusAPI.getMyUniversities();
      if (res.data.universities.length > 0) {
        const id = res.data.universities[0].university._id;
        setUniversityId(id);
        const uniRes = await campusAPI.getUniversity(id);
        const u = uniRes.data.university;
        setFormData({
          name: u.name || "",
          username: u.username || "",
          domain: u.domain || "",
          website: u.website || "",
          description: u.description || "",
          location: u.location || "",
          tier: u.tier || "",
          establishedYear: u.establishedYear ? String(u.establishedYear) : "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch university", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (universityId) {
        // Update existing
        await campusAPI.updateUniversity(universityId, formData);
        alert("University profile updated successfully!");
      } else {
        // Create new
        await campusAPI.register(formData);
        alert("University registered successfully!");
        fetchUniversity(); // refresh to get the ID
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save university");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">University Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your academic institution's brand and details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Basic Information</h2>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-32 h-32 rounded-xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 hover:border-emerald-500/50 transition-colors cursor-pointer group">
              <Upload className="w-6 h-6 mb-2 group-hover:text-emerald-500 transition-colors" />
              <span className="text-xs font-medium">Upload Crest</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">University Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Stanford University"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Username (URL Slug) *</label>
                  <input 
                    type="text" 
                    required
                    disabled={!!universityId}
                    placeholder="e.g. stanford"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Domain (Email Extension) *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. stanford.edu"
                value={formData.domain}
                onChange={e => setFormData({...formData, domain: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Institution Tier</label>
              <select
                value={formData.tier}
                onChange={e => setFormData({...formData, tier: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="">Select Tier...</option>
                <option value="Tier 1">Tier 1 (Top Ranking)</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
                <option value="Unranked">Unranked</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">About the University</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Location & Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
              <input 
                type="url" 
                placeholder="https://"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
              <input 
                type="text" 
                placeholder="City, State"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Year Established</label>
              <input 
                type="number" 
                placeholder="e.g. 1885"
                value={formData.establishedYear}
                onChange={e => setFormData({...formData, establishedYear: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : (universityId ? "Save Changes" : "Register University")}
          </button>
        </div>
      </form>
    </div>
  );
}
