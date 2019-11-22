import PerformerQuery from '../../queries/Performer.gql';
import { Performer } from '../../definitions/Performer';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps } from '@reach/router';

import PerformerCard from './card/PerformerCard';
import SceneCard from '../sceneCard/SceneCard';

interface PerformerProps extends RouteComponentProps<{
    id: string;
}> {}

const PerformerComponent: React.FC<PerformerProps> = ({id}) => {
    const { loading, data } = useQuery<Performer>(PerformerQuery, {
        variables: { id }
    });

    if(loading)
        return <div>Loading performer...</div>;

    const scenes = data.getPerformer.performances.sort(
        (a, b) => { 
            if(a.date < b.date) return 1;
            else if(a.date > b.date) return -1;
            return -1;
        }
    ).map(p => (<SceneCard key={p.uuid} performance={p} />));

    return (
        <>
            <div className="performer-info">
                <PerformerCard performer={data.getPerformer} />
            </div>
            <hr />
            <div className="row">
                { scenes }
            </div>
        </>
    );
};

export default PerformerComponent;
