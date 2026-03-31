import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // UI-only stubs: simulate async API calls
  const login = async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 500));
    const fakeUser = { name: email.split('@')[0], email };
    setUser(fakeUser);
    return { ok: true, user: fakeUser };
  };

  const signup = async ({ name, email, password }) => {
    await new Promise((r) => setTimeout(r, 700));
    const newUser = { name: name || email.split('@')[0], email };
    setUser(newUser);
    return { ok: true, user: newUser };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
