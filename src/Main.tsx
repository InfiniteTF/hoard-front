import React, { useState, useEffect, useRef }  from 'react';
import AuthContext from './AuthContext';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps, navigate, Link } from '@reach/router';
import SearchField from './components/searchField';

import ME from './queries/Me.gql';

interface MainProps extends RouteComponentProps<{
    children?: any
}>{};

const Main: React.FC<MainProps> = ({ children }) => {
    const [username, setUsername] = useState(undefined);
    const prevUsername = useRef();
    const { loading } = useQuery(ME, {
        onCompleted: (data: any) => setUsername(data.me.username),
        onError: () => setUsername(null)
    });

    useEffect(() => {
        if(username === null)
            navigate('/login');
        else if(prevUsername.current === null)
            navigate('/');
        prevUsername.current = username;
    }, [username]);


    if(loading)
        return <div>Loading...</div>;

    const contextValue =  username !== null ? {
        authenticated: true,
        username: username
    } : {
        authenticated: false,
        setUsername
    };

    if(!contextValue.authenticated) {
        return (
            <AuthContext.Provider value={contextValue}>
                { children } :
            </AuthContext.Provider>
        );
    }

    return (
		<div>
			<Navbar bg="light" expand="lg">
				<Nav className="mr-auto">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/performers" className="nav-link">Performers</Link>
                    <Link to="/scenes" className="nav-link">Scenes</Link>
                    <Link to="/studios" className="nav-link">Studios</Link>
                    <Link to="/performer/add" className="nav-link">Add Performer</Link>
                    <Link to="/scene/add" className="nav-link">Add Scene</Link>
                    <Link to="/studio/add" className="nav-link">Add Studio</Link>
				</Nav>
				<div className="welcome">Welcome {username}!</div>
                <SearchField />
			</Navbar>
			<div id="hoard-content" className="container-fluid">
                <AuthContext.Provider value={contextValue}>
                    { children }
                </AuthContext.Provider>
			</div>
		</div>
    );
}

export default Main;
