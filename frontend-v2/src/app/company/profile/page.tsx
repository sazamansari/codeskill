"use client";

import { useEffect, useState } from "react";
import { companyAPI } from "@/config/api";
import { Save, Building2, Upload } from "lucide-react";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    industry: "",
    website: "",
    description: "",
    headquarters: "",
    companySize: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getMyCompanies();
      if (res.data.companies.length > 0) {
        const id = res.data.companies[0].company._id;
        setCompanyId(id);
        const companyRes = await companyAPI.getCompany(id);
        const c = companyRes.data.company;
        setFormData({
          name: c.name || "",
          username: c.username || "",
          industry: c.industry || "",
          website: c.website || "",
          description: c.description || "",
          headquarters: c.headquarters || "",
          companySize: c.companySize || "",
          email: c.email || "",
          phone: c.phone || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch company", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (companyId) {
        // Update existing
        await companyAPI.updateCompany(companyId, formData);
        alert("Company profile updated successfully!");
      } else {
        // Create new
        await companyAPI.register(formData);
        alert("Company registered successfully!");
        fetchCompany(); // refresh to get the ID
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save company");
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
        <h1 className="text-2xl font-bold text-foreground">Company Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your organization's public brand and contact details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Basic Information</h2>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-32 h-32 rounded-xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 hover:border-blue-500/50 transition-colors cursor-pointer group">
              <Upload className="w-6 h-6 mb-2 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-medium">Upload Logo</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Username (URL Slug) *</label>
                  <input 
                    type="text" 
                    required
                    disabled={!!companyId}
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Industry</label>
              <input 
                type="text" 
                placeholder="e.g. Software, Finance, Healthcare"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Company Size</label>
              <select
                value={formData.companySize}
                onChange={e => setFormData({...formData, companySize: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select Size...</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">About the Company</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Contact & Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
              <input 
                type="url" 
                placeholder="https://"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Headquarters</label>
              <input 
                type="text" 
                placeholder="City, Country"
                value={formData.headquarters}
                onChange={e => setFormData({...formData, headquarters: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
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
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : (companyId ? "Save Changes" : "Register Company")}
          </button>
        </div>
      </form>
    </div>
  );
}
