import gql from 'graphql-tag';
import React, { useRef, useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { setToken } from './utils/createClient';
import AuthContext from './AuthContext';
import { RouteComponentProps, navigate } from '@reach/router';

const LOGIN = gql`
    mutation LoginUser($email: String!, $password: String!) {
        loginUser(input: {
            email: $email,
            password: $password
        }) {
            bearer,
            user {
                email
            }
        }
    }
`;

const Login: React.FC<RouteComponentProps> = () => {
    const Auth = useContext<any>(AuthContext);
    const [loginUser] = useMutation(LOGIN, {
        onCompleted: ({ loginUser: {bearer, user }}) => {
            setToken(bearer);
            Auth.setUsername(user.email);
        }
    });
    const logged_in = useState(false);
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
        logged_in ? (
        <div>
            Please log in:
            <label>Email: <input ref={email} type="text"></input></label>
            <label>Password: <input ref={password} type="password"></input></label>
            <button type="submit" onClick={submitLogin}>Login</button>
        </div>) : (
            <div>asd</div>
        )
    );
}

export default Login;
