import gql from 'graphql-tag';
import React, { useRef, useState, useContext } from 'react';
import LoginMutation from './queries/Login.gql';
import { useMutation } from '@apollo/react-hooks';
import { setToken } from './utils/createClient';
import AuthContext from './AuthContext';
import { RouteComponentProps, navigate } from '@reach/router';

import './App.scss'


const Login: React.FC<RouteComponentProps> = () => {
    const Auth = useContext<any>(AuthContext);
    const [loginUser] = useMutation(LoginMutation, {
        onCompleted: ({ loginUser: {bearer, user }}) => {
            setToken(bearer);
            Auth.setUser(user);
        }
    });
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    if(Auth.authenticated)
        navigate('/');

    const submitLogin = () => {
        loginUser({ variables: {
            email: email && email.current && email.current.value || '',
            password: password && password.current && password.current.value
        }});
    }

    return (
        <div className="LoginPrompt">
            <div className="email">
                <label>Email: <input ref={email} type="text"></input></label>
            </div>
            <div className="password">
                <label>Password: <input ref={password} type="password"></input></label>
            </div>
            <button type="submit" className="login-button btn btn-primary" onClick={submitLogin}>Login</button>
        </div>
    );
}

export default Login;
