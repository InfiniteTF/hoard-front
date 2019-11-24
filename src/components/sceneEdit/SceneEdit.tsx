import SceneQuery from '../../queries/Scene.gql';
import { Scene } from '../../definitions/Scene';
import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { RouteComponentProps } from '@reach/router';
import UpdateSceneMutation from '../../queries/UpdateScene.gql';
import { navigate } from '@reach/router';

import { LoadingIndicator } from '../fragments';
import SceneForm from '../sceneForm';

interface SceneProps extends RouteComponentProps<{
    id: string;
}> {}

const SceneEdit: React.FC<SceneProps> = ({id}) => {
    const { loading, data } = useQuery<Scene>(SceneQuery, {
        variables: { id }
    });
    const [ updateScene ] = useMutation<Scene>(UpdateSceneMutation, {onCompleted: () => {
        navigate(`/scene/${data.getScene.uuid}`);
    }});
    
    const doUpdate = (updateData:any, performers:any = null) => {
        updateScene({ variables: { sceneId: data.getScene.id, sceneData: updateData, performers } });
    }

    if(loading)
        return <LoadingIndicator message="Loading studio..." />

    return (
        <div>
            <h2>Edit '<i>{data.getScene.title}</i>'</h2>
            <hr />
            <SceneForm scene={data.getScene } callback={doUpdate} />
        </div>
    );

};

export default SceneEdit;
