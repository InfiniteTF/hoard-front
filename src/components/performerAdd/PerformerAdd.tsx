import { Performer_getPerformer as Performer } from '../../definitions/Performer';
import { AddPerformerMutation as NewPerformer } from '../../definitions/AddPerformerMutation';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import AddPerformerMutation from '../../queries/AddPerformer.gql';
import { RouteComponentProps, navigate } from '@reach/router';

import PerformerForm from '../performerForm';

const PerformerAdd: React.FC<RouteComponentProps> = () => {
    const [ insertPerformer] = useMutation<NewPerformer>(AddPerformerMutation, {onCompleted: (data) => {
        navigate(`/performer/${data.addPerformer.uuid}`);
    }});
    
    const doInsert = (insertData:any) => {
        insertPerformer({ variables: { performerData: insertData } });
    }

    const emptyPerformer = {
        name: null,
        disambiguation: null,
        gender: null,
        birthdate: null,
        birthdateAccuracy: null,
        careerStart: null,
        careerEnd: null,
        height: null,
        cupSize: null,
        bandSize: null,
        waistSize: null,
        hipSize: null,
        countryId: null,
        ethnicity: null,
        location: null,
        eyeColor: null,
        hairColor: null,
        tattoos: null,
        piercings: null,
        aliases: null,
        photoUrl: null
    } as Performer;

    return (
        <div>
            <h2>Add new performer</h2>
            <hr />
            <PerformerForm performer={emptyPerformer} callback={doInsert} />
        </div>
    );

};

export default PerformerAdd;
