import { Performer_getPerformer_performances as Performance } from '../../definitions/Performer';
import React from 'react';
import { Link } from '@reach/router';
import { Card } from 'react-bootstrap';

const SceneCard: React.FC<{performance: Performance}> = ({ performance }) => {
    return (
        <div className="col-3">
            <Card>
                <Card.Header>
                    <Link to={`/studio/${performance.studio.uuid}`}>
                        { performance.studio.title }
                    </Link>
                </Card.Header>
                <Card.Body>
                    <img src={performance.photoUrl} style={{width: "100%"}} />
                </Card.Body>
                <Card.Footer>
                    <Link to={`/scene/${performance.uuid}`}><h4>{performance.title}</h4></Link>
                    <h6>{performance.date}</h6>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default SceneCard;
