import { JWT, signOut } from "aws-amplify/auth";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
// Define the user type and authentication state type
type User = {
  password: string;
  email: string;
  // Add more user properties as needed
};
interface Auth {
  isSignedIn: boolean;
  token: string | null;
}
type AuthState = {
  // user: User | null;
  auth: Auth | null;
  loading: boolean;
  isSignedIn: boolean;
  login: (data: JWT) => void;
  logout: () => void;
};

const initialState: AuthState = {
  auth: null,
  loading: false,
  isSignedIn: false,
  login: () => null,
  logout: () => {},
};

type AuthProviderProps = {
  children: ReactNode;
};

// Create the authentication context
const AuthContext = createContext<AuthState>(initialState);

// Define the authentication context provider
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  // const [user, setUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  // /users/details/32
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (auth?.isSignedIn) {
      setIsSignedIn(true);
      setAuth(auth);
    }
  }, []);

  const login = async (idToken: JWT) => {
    let auth = {
      isSignedIn: true,
      token: idToken?.toString(),
      email: idToken.payload.email,
    };
    // Store initial auth data in localStorage for axios intercepter
    localStorage.setItem("auth", JSON.stringify(auth));

    // Set auth in the state
    setAuth(auth);
    setIsSignedIn(true);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    signOut();
    navigate("/sign-in");
  };

  const value = {
    auth,
    loading: false,
    isSignedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
