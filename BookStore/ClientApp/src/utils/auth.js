import { createContext, useCallback, useContext, useRef, useState } from "react";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(null);
    
    return (
        <AuthContext.Provider value={{
            accessToken,
            setAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    )
};

const AuthConsumer = ({ children }) => {
    return (
        <AuthContext.Consumer>
            {context => {
                if (context === undefined) {
                    throw new Error('AuthConsumer must be used within a AuthProvider.')
                }
                return children(context)
            }}
        </AuthContext.Consumer>
    )
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthProvider, AuthConsumer, useAuth };