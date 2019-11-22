import ScenesQuery from '../../queries/Scenes.gql';
import SceneCountQuery from '../../queries/SceneCount.gql';
import { Scenes } from '../../definitions/Scenes';
import { SceneCount } from '../../definitions/SceneCount';
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Card } from 'react-bootstrap';
import { RouteComponentProps, Link } from '@reach/router';
import Pagination from '../pagination';


const Scenes: React.FC<RouteComponentProps> = () => {
    const [page, setPage] = useState(1);
    const { loading: loadingData, data } = useQuery<Scenes>(ScenesQuery, {
        variables: {skip: (20 * page)-20, limit: 20}
    });
    const { loading: loadingTotal, data: countData } = useQuery<SceneCount>(SceneCountQuery);

    if (loadingTotal)
        return <div>Loading scenes...</div>

    const handlePagination = (page:number) => setPage(page);
    const totalPages = Math.ceil(countData.sceneCount / 20)

    const scenes = loadingData ? <div>Loading scenes...</div>  : data.getScenes.map(scene => (
        <div key={scene.uuid} className="col-12 col-lg-3 col-md-6">
            <Card>
                <Link to={`/scene/${scene.uuid}`}>
                    <Card.Img variant="top" src={scene.photoUrl} />
                    <Card.Title>{scene.title}</Card.Title>
                </Link>
            </Card>
        </div>
    ));

    return (
        <>
            <div className="row">
                <h3 className="col-4">Scenes</h3>
                <Pagination onClick={handlePagination} pages={totalPages} active={page} />
            </div>
            <div className="performers row">{scenes}</div>
            <div className="row">
                <Pagination onClick={handlePagination} pages={totalPages} active={page} />
            </div>
        </>
    );
};

export default Scenes;
