import React from 'react';

type ContextProps = { 
    authenticated: boolean,
    username?: string,
    setUsername?: any
};

const AuthContext = React.createContext<ContextProps>({
    authenticated: false,
});

export default AuthContext;
