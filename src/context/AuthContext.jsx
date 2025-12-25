import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    //LogIn function
    const login = (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    //LogOut function
    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            isAuthenticated: !!token,
            loading,
            login,
            logout
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
