import { toast } from "@/hooks/use-toast";
import { IUser, IUserCredential } from "@/interfaces/User";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

export const api = axios.create({
    baseURL: STORAGE_URL,
});

interface IAuthContextProps {
    credential?: IUserCredential;
    user?: IUser;
    setAsLogged: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContextProps | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [credential, setCredential] = useState<IUserCredential>();
    const [user, setUser] = useState<IUser>();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) {
            if (location.pathname === "/dashboard") {
                navigate("/")
                return; 
            }
            return;
        }
        getUser(token);
    }, []);

    const getUser = (token: string, isLogin: boolean = false) => {
        if (token) {
            axios
                .get(`http://localhost:7001/credential-by-email`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data: authUser }) => {
                    
                    api.interceptors.request.use((config) => {
                        config.headers.Authorization = `Bearer ${token}`;
                        return config;
                    });
                    setCredential(authUser);
                    
                    axios.get('http://localhost:7001/credential-user-by-email',{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then(({data: user}) =>{
                        setUser(user);
                    })
                    if (isLogin) {
                        setTimeout(() => {
                            toast({
                                className: "bg-white",
                              title: "Logged in successfully!",
                              description: "Welcome back to EduHub.",
                            })
                            navigate("/dashboard")
                          }, 1000)   
                    }
                })
                .catch((err) => {
                    navigate("/login");
                    console.log(err);
                });
        }
    };

    const setAsLogged = (token: string) => {
        // setto il valore del token in localStorage
        localStorage.setItem("ACCESS_TOKEN", token);
        getUser(token, true);
    };

    const logout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        setCredential(undefined);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{user, credential, setAsLogged, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
