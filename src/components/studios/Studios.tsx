import StudiosQuery from '../../queries/Studios.gql';
import { Studios } from '../../definitions/Studios';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Card } from 'react-bootstrap';
import { RouteComponentProps, Link } from '@reach/router';

const Studios: React.FC<RouteComponentProps> = () => {
    const { loading: loadingData, data } = useQuery<Studios>(StudiosQuery, {
        variables: {skip: 0, limit: 1000}
    });

    if (loadingData)
        return <div>Loading studios...</div>


    const studios = data.getStudios;

    const studioList = studios.map(studio => (
        <li key={studio.uuid}>
            <Link to={`/studio/${studio.uuid}`}>{studio.title}</Link> • <a href={studio.url}>{studio.url}</a>
        </li>
    ));

    return (
        <Card>
            <Card.Header>
                <h2>Studios</h2>
            </Card.Header>
            <Card.Body>
                <ul>{studioList}</ul>
            </Card.Body>
        </Card>
    );
};

export default Studios;
