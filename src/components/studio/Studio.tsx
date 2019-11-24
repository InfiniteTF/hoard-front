import StudioQuery from '../../queries/Studio.gql';
import { Studio } from '../../definitions/Studio';
import React, { useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps, Link } from '@reach/router';
import Pagination from '../pagination';

import { LoadingIndicator } from '../fragments';
import SceneCard from '../sceneCard/SceneCard';

interface StudioProps extends RouteComponentProps<{
    id: string;
}> {}

const Studio: React.FC<StudioProps> = ({id}) => {
    const [page, setPage] = useState(1);
    const { loading, data } = useQuery<Studio>(StudioQuery, {
        variables: { id, skip: (40 * page)-40, limit: 40}
    });

    if(loading)
        return <LoadingIndicator message="Loading studio..." />

    const studio = data.getStudio;

    const handlePagination = (page:number) => setPage(page);

    const totalPages = Math.ceil(studio.sceneCount / 40)
    const scenes = studio.scenes.sort(
        (a, b) => { 
            if(a.date < b.date) return 1;
            else if(a.date > b.date) return -1;
            return -1;
        }
    ).map(p => (<SceneCard key={p.uuid} performance={p} />));

    const handleDelete = () => {
    }

    return (
        <>
            <div className="studio-header">
                <div className="studio-title">
                    <h2>{studio.title}</h2>
                    <h4><a href={studio.url}>{studio.url}</a></h4>
                </div>
                <div className="studio-photo">
                    { studio.photoUrl && <img src={studio.photoUrl} /> }
                </div>
                <div className="studio-edit">
                    <Link to="edit">
                        <button type="button" className="btn btn-secondary">Edit</button>
                    </Link>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </div>
            <hr />
            <div className="row">
                <h3 className="col-4">Scenes</h3>
                <Pagination onClick={handlePagination} pages={totalPages} active={page} />
            </div>
            <div className="row">
                { scenes }
            </div>
            <div className="row">
                <Pagination onClick={handlePagination} pages={totalPages} active={page} />
            </div>
        </>
    );
};

export default Studio;
