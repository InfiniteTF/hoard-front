import StudioQuery from '../../queries/Studio.gql';
import { Studio } from '../../definitions/Studio';
import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { RouteComponentProps } from '@reach/router';
import UpdateStudioMutation from '../../queries/UpdateStudio.gql';
import { navigate } from '@reach/router';

import StudioForm from '../studioForm';

interface StudioProps extends RouteComponentProps<{
    id: string;
}> {}

const StudioEdit: React.FC<StudioProps> = ({id}) => {
    const { loading, data } = useQuery<Studio>(StudioQuery, {
        variables: { id }
    });
    const [ updateStudio ] = useMutation<Studio>(UpdateStudioMutation, {onCompleted: () => {
        navigate(`/studio/${data.getStudio.uuid}`);
    }});
    
    const doUpdate = (updateData:any) => {
        updateStudio({ variables: { studioId: data.getStudio.id, studioData: updateData } });
    }

    if(loading)
        return <div>Loading studio...</div>;

    return (
        <div>
            <h2>Edit '<i>{data.getStudio.title}</i>'</h2>
            <hr />
            <StudioForm studio={data.getStudio } callback={doUpdate} />
        </div>
    );

};

export default StudioEdit;
