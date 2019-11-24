import StudioQuery from '../../queries/Studios.gql';
import { Scene_getScene as Scene } from '../../definitions/Scene';
import { Search_search_performers as PerformerResult } from '../../definitions/Search';
import { Studios } from '../../definitions/Studios';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps, Link } from '@reach/router';
import useForm from 'react-hook-form';
import Select from 'react-select'
import * as yup from 'yup';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cx from 'classnames';

import { GenderIcon, LoadingIndicator } from '../fragments';
import SearchField, { SearchType } from '../searchField';

const nullCheck = ((input, originalValue) => {
    return input === '' || input === 0  || Number.isNaN(input) || input === 'null' ? null : input
});

const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().trim(),
    date: yup.string().transform(nullCheck).matches(/^\d{4}$|^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$/, { excludeEmptyString: true} ).nullable(),
    studioId: yup.number().transform(nullCheck).required(),
    photoURL: yup.string().url().transform(nullCheck).nullable(),
    studioURL: yup.string().url().transform(nullCheck).nullable(),
    performers: yup.array().nullable()
});

interface SceneProps extends RouteComponentProps<{
    scene: Scene,
    callback: any
}>{};

interface PerformerInfo {
    name: string;
    alias?: string;
    displayName: string;
    uuid: string;
    id: number;
    gender: string;
}

const SceneForm: React.FC<SceneProps> = ({scene, callback}) => {
    const { register, handleSubmit, setValue, errors } = useForm({
        validationSchema: schema,
    });
    const [photoURL, setPhotoURL] = useState(scene.photoUrl);
    const [performers, setPerformers] = useState<PerformerInfo[]>(
       scene.performers.map(p => ({
           displayName: p.performer.displayName,
           uuid: p.performer.uuid,
           id: p.performer.id,
           name: p.performer.name,
           alias: p.alias,
           gender: p.performer.gender
       }))
    );
    const { loading: loadingStudios, data: studios } = useQuery<Studios>(StudioQuery, {
        variables: { skip: 0, limit: 1000}
    });
    useEffect(() => {
        register({ name: "studioId" });
        setValue('studioId', scene.studio.id);
    }, [register]);
    
    if(loadingStudios)
        return <LoadingIndicator message="Loading scene..." />

    const onURLChange = (e: React.ChangeEvent<HTMLInputElement>) => (
        setPhotoURL(e.currentTarget.value))
    const onSelectChange = (name:string, selectedOption:{label:string, value:number}) => (
        setValue(name, selectedOption.value))

    const onSubmit = (data:any) => {
        if(data.date !== null) {
            if(data.date.length === 10)
                data.dateAccuracy = 3;
            else if(data.birthdate.length == 7){
                data.datAccuracy = 2;
                data.date = `${data.date}-01`;
            }
            else {
                data.dateAccuracy = 1;
                data.date = `${data.date}-01-01`;
            }
        }
        const performers = (data.performer || []).map(p => ({
            performerId: parseInt(p.performerId),
            alias: p.alias || null
        }));
        delete data.performer;
        callback(data, performers);
    };

    const studioObj = studios.getStudios.map(studio => ({value: studio.id, label: studio.title}))

    const addPerformer = (result:PerformerResult) => setPerformers(
        [...performers, { name: result.name, displayName: result.displayName, uuid: result.uuid, gender: result.gender, id: result.id }]
    );
    const removePerformer = (uuid:string) => setPerformers(performers.filter(p => p.uuid !== uuid));
    const performerList = performers.map((p, index) => {
        return (
            <div className="performer-item" key={p.uuid}>
                <button className="performer-remove" type="button" onClick={removePerformer.bind(null, p.uuid)}><FontAwesomeIcon icon={faTimesCircle} /></button>
                <GenderIcon gender={p.gender} />
                <input type="hidden" value={p.id} name={`performer[${index}].performerId`} ref={register} />
                <span className="performer-name">{p.displayName}</span>
                <label htmlFor={`performer[${index}].alias`}>Alias used: </label>
                <input className="performer-alias" type="text" name={`performer[${index}].alias`} defaultValue={p.alias !== p.name ? p.alias : '' } placeholder={p.name}  ref={register} />
            </div>
        );
    });

	return (
        <form className={cx('SceneForm', {'was-validated': Object.keys(errors).length})} onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-6">
                    <div className="form-group row">
                        <div className="col-8">
                            <label htmlFor="title">Title</label>
                            <input className={cx('form-control', {'is-invalid': errors.title})} type="text" placeholder="Title" name="title" defaultValue={scene.title} ref={register({required: true})} />
                        </div>
                        <div className="col-4">
                            <label htmlFor="date">Date</label>
                            <input className="form-control" type="text" placeholder="YYYY-MM-DD" name="date" defaultValue={
                                    scene.date === null ? '' :
                                    scene.dateAccuracy === 3 ? scene.date: 
                                    scene.dateAccuracy === 2 ? scene.date.slice(0,7) :
                                    scene.date.slice(0,4)
                            } ref={register} />
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col">
                            <label htmlFor="performers">Performers</label>
                            { performerList }
                            <div className="add-performer">
                                <span>Add performer:</span>
                                <SearchField onClick={addPerformer} searchType={SearchType.Performer} />
                            </div>
                        </div>
                    </div>


                    <div className="form-group row">
                        <div className="col-6">
                            <label htmlFor="studioId">Studio</label>
                            <Select
                                name="studioId"
                                onChange={onSelectChange.bind(null, "studioId")}
                                options={studioObj}
                                defaultValue={ studioObj.find(s => s.value == scene.studio.id) }
                            />
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="studioUrl">Studio URL</label>
                                <input type="url" className="form-control" name="studioUrl" defaultValue={scene.studioUrl} ref={register} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col">
                            <label htmlFor="description">Description</label>
                            <textarea className="form-control description" placeholder="Description" name="description" defaultValue={scene.description} ref={register} />
                        </div>
                    </div>

                    <div className="form-group button-row">
                        <input className="btn btn-primary col-2 save-button" type="submit" value="Save" />
                        <input className="btn btn-secondary offset-6 reset-button" type="reset" />
                        <Link to={scene.uuid ? `/scene/${scene.uuid}` : '/scenes'}>
                            <button className="btn btn-danger reset-button" type="button">Cancel</button>
                        </Link>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label htmlFor="photoUrl">Photo URL</label>
                        <input type="url" className="form-control" name="photoUrl" onChange={onURLChange} defaultValue={scene.photoUrl} ref={register} />
                    </div>
                    <img src={photoURL} />
                </div>
            </div>
        </form>
    );
};

export default SceneForm;
