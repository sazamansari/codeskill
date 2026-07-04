import re

with open('/Users/mdshadabazamansari/Downloads/Source Code/frontend-v2/src/context/AuthContext.tsx', 'r') as f:
    content = f.read()

# Add isAdmin to User interface
content = content.replace(
    'role: string;',
    'role: string;\n  isAdmin?: boolean;'
)

# Add adminLogin to AuthContextType
content = content.replace(
    'login: (data: any) => Promise<any>;',
    'login: (data: any) => Promise<any>;\n  adminLogin: (data: any) => Promise<any>;'
)

# Add adminLogin function
admin_login_func = """
  const adminLogin = useCallback(async (data: any) => {
    try {
      setError(null);
      const res = await authAPI.adminLogin(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("codeskill_token", res.data.token);
      }
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Admin login failed";
      setError(msg);
      throw new Error(msg);
    }
  }, []);
"""

content = content.replace(
    '  const logoutUser = useCallback(() => {',
    admin_login_func + '\n  const logoutUser = useCallback(() => {'
)

# Export adminLogin in context provider
content = content.replace(
    'login: loginUser,',
    'login: loginUser,\n    adminLogin,'
)

with open('/Users/mdshadabazamansari/Downloads/Source Code/frontend-v2/src/context/AuthContext.tsx', 'w') as f:
    f.write(content)
