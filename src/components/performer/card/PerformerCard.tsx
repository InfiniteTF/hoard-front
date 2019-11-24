import { Performer_getPerformer as Performer } from '../../../definitions/Performer';
import React, { useState, useContext } from 'react';
import AuthContext from '../../../AuthContext';
import DeletePerformerMutation from '../../../queries/DeletePerformer.gql';
import { useMutation } from '@apollo/react-hooks';
import { Link, navigate } from '@reach/router';
import { Card, Table } from 'react-bootstrap';

import Modal from '../../modal';
import { GenderIcon } from '../../fragments';

const PerformerCard: React.FC<{performer: Performer}> = ({ performer }) => {
    const [showDelete, setShowDelete] = useState(false);
    const [deletePerformer, { loading: deleting } ] = useMutation(DeletePerformerMutation, {
        variables: { performerId: performer.id }
    });
    const auth = useContext(AuthContext);

    const toggleModal = () => {
        setShowDelete(true);
    }

    const handleDelete = (status:boolean):void => {
        if(status)
            deletePerformer().then(() => navigate('/performers'))
        setShowDelete(false);
    }

    return (
        <>
        { showDelete && <Modal message={`Are you sure you want to delete '${performer.name}`} callback={handleDelete} /> }
        <div className="row">
            <div className="col-6">
                <Card>
                    <Card.Header>
                        <div className="float-right">
                            <Link to="edit">
                                <button type="button" className="btn btn-secondary">Edit</button>
                            </Link>
                            { auth.user.role > 1 && <button type="button" disabled={showDelete || deleting} className="btn btn-danger" onClick={toggleModal}>Delete</button> }
                        </div>
                        <h2>
                        <GenderIcon gender={performer.gender} />
                        {performer.displayName}
                        </h2>
                    </Card.Header>
                    <Card.Body className="performer-card-body">
                        <Table striped className="performer-table">
                            <tbody>
                                <tr>
                                    <td>Career</td>
                                    <td>
                                    { performer.careerEnd ? 
                                      `Active ${performer.careerStart || '????'}-${performer.careerEnd}` :
                                      performer.careerStart ? `Active from ${performer.careerStart}` :
                                      'Unknown Activity' 
                                    }
                                    </td>
                                </tr>
                                <tr><td>Birthdate</td><td> { performer.birthdate }</td></tr>
                                <tr><td>Height</td><td>{ performer.height && <div>Height: { performer.height }cm</div> }</td></tr>
                                <tr>
                                    <td>Measurements</td>
                                    <td>
                                    { performer.cupSize && performer.bandSize ? `${performer.bandSize}${performer.cupSize}-` : '??-' }
                                    { performer.waistSize ? `${performer.waistSize}-` : '??-' }
                                    { performer.hipSize ? `${performer.hipSize}` : '??' }
                                    </td>
                                </tr>
                                { (performer.gender === 'female' || performer.gender === 'transfemale') && <tr><td>Breast type</td><td>{ performer.boobJob === false ? 'Natural' : performer.boobJob === true ? 'Augmented' : 'Unknown'}</td></tr> }
                                <tr><td>Nationality</td><td>{ performer.countryId }</td></tr>
                                <tr><td>Birthplace</td><td>{ performer.location }</td></tr>
                                <tr><td>Ethnicity</td><td>{ performer.ethnicity }</td></tr>
                                <tr><td>Eye color</td><td>{ performer.eyeColor }</td></tr>
                                <tr><td>Hair color</td><td>{ performer.hairColor }</td></tr>
                                <tr><td>Tattoos</td><td>{ (performer.tattoos || []).join(', ') }</td></tr>
                                <tr><td>Piercings</td><td>{ (performer.piercings|| []).join(', ') }</td></tr>
                                <tr><td>Aliases</td><td>{ (performer.aliases || []).join(', ') }</td></tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                </div>
                <div className="col-6 performer-photo">
                    <img src={performer.photoUrl} style={{height: "100%"}}/>
                </div>
            </div>
        </>
    );
};

export default PerformerCard;
