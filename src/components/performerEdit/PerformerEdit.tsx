import PerformerQuery from '../../queries/Performer.gql';
import { Performer } from '../../definitions/Performer';
import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { RouteComponentProps } from '@reach/router';
import UpdatePerformerMutation from '../../queries/UpdatePerformer.gql';
import { navigate } from '@reach/router';

import PerformerForm from '../performerForm';

interface PerformerProps extends RouteComponentProps<{
    id: string;
}> {}

const PerformerEdit: React.FC<PerformerProps> = ({id}) => {
    const { loading, data } = useQuery<Performer>(PerformerQuery, {
        variables: { id }
    });
    const [ updatePerformer] = useMutation<Performer>(UpdatePerformerMutation, {onCompleted: () => {
        navigate(`/performer/${data.getPerformer.uuid}`);
    }});
    
    const doUpdate = (updateData:any) => {
        updatePerformer({ variables: { performerId: data.getPerformer.id, performerData: updateData } });
    }

    if(loading)
        return <div>Loading performer...</div>;

    return (
        <div>
            <h2>Edit '<i>{data.getPerformer.name}</i>'</h2>
            <hr />
            <PerformerForm performer={data.getPerformer} callback={doUpdate} />
        </div>
    );

};

export default PerformerEdit;
