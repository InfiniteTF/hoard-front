import React from 'react';

type ContextProps = { 
    authenticated: boolean,
    user?: {
        username?: string,
        setUser?: any,
        role?: number 
    }
};

const AuthContext = React.createContext<ContextProps>({
    authenticated: false,
});

export default AuthContext;
