import { Studio_getStudio as Studio} from '../../definitions/Studio';
import { AddStudioMutation as NewStudio } from '../../definitions/AddStudioMutation';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import AddStudioMutation from '../../queries/AddStudio.gql';
import { RouteComponentProps, navigate } from '@reach/router';

import StudioForm from '../studioForm';

const StudioAdd: React.FC<RouteComponentProps> = () => {
    const [insertStudio] = useMutation<NewStudio>(AddStudioMutation, {onCompleted: (data) => {
        navigate(`/studio/${data.addStudio.uuid}`);
    }});
    
    const doInsert = (insertData:any) => {
        insertStudio({ variables: { studioData: insertData } });
    }

    const emptyStudio= {
        title: null,
        url: null,
        photoUrl: null
    } as Studio;

    return (
        <div>
            <h2>Add new studio</h2>
            <hr />
            <StudioForm studio={emptyStudio} callback={doInsert} />
        </div>
    );

};

export default StudioAdd;
