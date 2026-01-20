import { createContext, useState, useEffect } from 'react';
import api from '../Services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                toast.success('Login successful!');
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/', { name, email, password });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                toast.success('Registration successful!');
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
