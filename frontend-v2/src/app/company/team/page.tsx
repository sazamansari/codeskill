"use client";

import { useEffect, useState } from "react";
import { companyTeamAPI, companyAPI } from "@/config/api";
import { Search, UserPlus, ShieldAlert, Trash2, ShieldCheck, Briefcase } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CompanyTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  
  // Invite form state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Recruiter");
  const [inviteDesignation, setInviteDesignation] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getMyCompanies();
      if (res.data.companies.length > 0) {
        const id = res.data.companies[0].company._id;
        setCompanyId(id);
        fetchTeam(id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load company context", err);
      setLoading(false);
    }
  };

  const fetchTeam = async (cId: string) => {
    try {
      const res = await companyTeamAPI.getAll(cId);
      setTeam(res.data.team);
    } catch (err) {
      console.error("Failed to fetch team", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    try {
      setInviting(true);
      await companyTeamAPI.invite(companyId, {
        email: inviteEmail,
        role: inviteRole,
        designation: inviteDesignation || inviteRole
      });
      alert("User successfully added to your team!");
      setShowInviteForm(false);
      setInviteEmail("");
      fetchTeam(companyId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to invite user");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId: string, userName: string) => {
    if (!companyId) return;
    if (confirm(`Are you sure you want to remove ${userName} from the company?`)) {
      try {
        await companyTeamAPI.remove(companyId, userId);
        fetchTeam(companyId);
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to remove user");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading team...</div>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No Company Found</h1>
        <p className="text-muted-foreground mb-8">Please create a company profile first before managing your team.</p>
        <Link href="/company/profile" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">Create Company Profile</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage recruiters, admins, and interviewers for your company.</p>
        </div>
        <button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {showInviteForm && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4 fade-in duration-200">
          <h2 className="text-lg font-bold text-foreground mb-4">Add a new member</h2>
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">User's Email *</label>
              <input 
                type="email" 
                required
                placeholder="User must already have a CodeSkill account"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Role *</label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              >
                <option value="Admin">Admin</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Interviewer">Interviewer</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={inviting}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full h-[38px]"
            >
              {inviting ? "Adding..." : "Add Member"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search team members..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
            />
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {team.length} {team.length === 1 ? 'member' : 'members'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">Team Member</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Added On</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {team.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No team members found.</td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {member.user?.avatar ? (
                            <img src={member.user.avatar} alt={member.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-medium text-muted-foreground text-xs">{member.user?.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{member.user?.name}</div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">{member.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.role === "Owner" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <ShieldAlert className="w-3.5 h-3.5" /> Owner
                        </span>
                      ) : member.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {member.designation}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {member.user?._id !== currentUser?.id && member.role !== "Owner" && (
                          <button 
                            onClick={() => handleRemove(member.user?._id, member.user?.name)}
                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
