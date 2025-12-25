import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken]= useState(null);
    const [loading, setLoading] = useState(true);

    //Auto-Login if token exists in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    //Login function
    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    //LogOut function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return(
        <AuthContext.Provider
            value={
                {user, token, isAuthenticated: !!token, login, logout, loading}
            }
        >
                {children}
        </AuthContext.Provider>
    );
};

//Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);