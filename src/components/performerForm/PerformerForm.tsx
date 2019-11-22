import PerformerQuery from '../../queries/Performer.gql';
import CountryQuery from '../../queries/Country.gql';
import { Performer_getPerformer as Performer } from '../../definitions/Performer';
import { Countries } from '../../definitions/Countries';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps, Link } from '@reach/router';
import useForm from 'react-hook-form';
import Select from 'react-select'
import * as yup from 'yup';

type OptionEnum = {
    value:string;
    label:string;
}

const GENDER:OptionEnum[] = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "transfemale", label: "Transfemale" },
    { value: "transmale", label: "Transmale" },
    { value: "Other", label: "Other" }
];

const HAIR:OptionEnum[] = [
    { value: "null", label: "Unknown" },
    { value: "blonde", label: "Blonde" },
    { value: "brunette", label: "Brunette" },
    { value: "black", label: "Black" },
    { value: "red", label: "Red" },
    { value: "auburn", label: "Auburn" },
    { value: "grey", label: "Grey" },
    { value: "bald", label: "Bald" },
    { value: "various", label: "Various" },
    { value: "other", label: "Other" }
];

const BREAST:OptionEnum[] = [
    { value: "null", label: "Unknown" },
    { value: "natural", label: "Natural" },
    { value: "augmented", label: "Augmented" }
]

const EYE:OptionEnum[] = [
    { value: "null", label: "Unknown" },
    { value: "blue", label: "Blue" },
    { value: "brown", label: "Brown" },
    { value: "grey", label: "Grey" },
    { value: "green", label: "Green" },
    { value: "hazel", label: "Hazel" },
    { value: "red", label: "Red" }
]

const ETHNICITY:OptionEnum[] = [
    { value: "null", label: "Unknown" },
    { value: "caucasian", label: "Caucasian" },
    { value: "black", label: "Black" },
    { value: "asian", label: "Asian" },
    { value: "indian", label: "Indian" },
    { value: "latino", label: "Latino" },
    { value: "middleeastern", label: "Middle Eastern" },
    { value: "mixed", label: "Mixed" },
    { value: "other", label: "Other" }
];

const getEnumValue = (enumArray:OptionEnum[], val:string)  => {
    if(val === null)
        return enumArray[0].value;
    else
        return val.toLowerCase();
}

const nullCheck = ((input, originalValue) => {
    return input === '' || input === 0  || Number.isNaN(input) || input === 'null' ? null : input
});

const schema = yup.object().shape({
    name: yup.string().required(),
    gender: yup.string().oneOf(GENDER.map(g => g.value)).required(),
    disambiguation: yup.string().trim(),
    birthdate: yup.string().transform(nullCheck).matches(/^\d{4}$|^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$/, { excludeEmptyString: true} ).nullable(),
    careerStart: yup.number().transform(nullCheck).nullable().min(1950).max(new Date().getFullYear()),
    careerEnd: yup.number().transform(nullCheck).min(1950).max(new Date().getFullYear()).nullable(),
    height: yup.number().transform(nullCheck).min(100).max(230).nullable(),
    cupSize: yup.string().transform(nullCheck).matches(/\d{2,3}[a-zA-Z]{1,4}/).nullable(),
    waistSize: yup.number().transform(nullCheck).min(15).max(50).nullable(),
    hipSize: yup.number().transform(nullCheck).nullable(),
    boobJob: yup.string().transform(nullCheck).oneOf([null, ...BREAST.map(b => b.value)]).nullable(),
    countryId: yup.number().min(0).max(1000).transform(nullCheck).nullable(),
    ethnicity: yup.string().transform(nullCheck).oneOf([null, ...ETHNICITY.map(e => e.value)]).nullable(),
    location: yup.string().trim().transform(nullCheck).nullable(),
    eyeColor: yup.string().transform(nullCheck).nullable().oneOf([null, ...EYE.map(e => e.value)]),
    hairColor: yup.string().transform(nullCheck).nullable().oneOf([null, ...HAIR.map(h => h.value)]),
    tattoos: yup.string().trim().transform(nullCheck).nullable(),
    piercings: yup.string().trim().transform(nullCheck).nullable(),
    photoURL: yup.string().url().transform(nullCheck).nullable()
});

interface PerformerProps extends RouteComponentProps<{
    performer: Performer,
    callback: any
}>{};

const PerformerForm: React.FC<PerformerProps> = ({performer, callback}) => {
    const { register, handleSubmit, setValue } = useForm({
        validationSchema: schema,
    });
    const [gender, setGender] = useState(performer.gender || 'female');
    const [photoURL, setPhotoURL] = useState(performer.photoUrl);
    const { loading: loadingCountries, data: countries } = useQuery<Countries>(CountryQuery);
    useEffect(() => {
        register({ name: "countryId" });
        setValue('countryId', performer.countryId);
    }, [register]);

    if(loadingCountries)
        return <div>Loading performer...</div>;

    const onGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => (
        setGender(e.currentTarget.value))
    const onURLChange = (e: React.ChangeEvent<HTMLInputElement>) => (
        setPhotoURL(e.currentTarget.value))
    const onSelectChange = (name:string, selectedOption:{label:string, value:number}) => (
        setValue(name, selectedOption.value))

    const enumOptions = (enums: OptionEnum[]) => (
        enums.map(obj => (<option key={obj.value} value={obj.value}>{obj.label}</option>))
    );

    const onSubmit = (data:any) => {
        data.boobJob =  data.boobJob === "natural" ? false : data.boobJob === "augmented" ? false : null;
        if(data.cupSize !== null) {
            data.bandSize = Number.parseInt(data.cupSize.match(/^\d+/)[0], 10);
            data.cupSize = data.cupSize.replace(data.bandSize, '').match(/^[a-zA-Z]+/)[0].toUpperCase();
        }
        if(data.gender !== "female" || data.gender !== "transfemale")
            data.boobJob = null;
        if(data.birthdate !== null) {
            if(data.birthdate.length === 10)
                data.birthdateAccuracy = 1;
            else if(data.birthdate.length == 7){
                data.birthdateAccuracy = 2;
                data.birthdate = `${data.birthdate}-01`;
            }
            else {
                data.birthdateAccuracy = 3;
                data.birthdate = `${data.birthdate}-01-01`;
            }
        }
        if(data.piercings !== null)
            data.piercings = data.piercings.split(';').map((p:string) => p.trim());
        if(data.tattoos !== null)
            data.tattoos = data.tattoos.split(';').map((p:string) => p.trim());
        callback(data);
    };

    const countryObj = countries.getCountries.map(country => ({value: country.id, label: country.name}))

	return (
        <form className="PerformerForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-8">
                    <div className="form-group row">
                        <div className="col-6">
                            <label htmlFor="name">Name</label>
                            <input className="form-control" type="text" placeholder="Name" name="name" defaultValue={performer.name} ref={register({required: true})} />
                        </div>
                        <div className="col-6">
                            <label htmlFor="disambiguation">Disambiguation</label>
                            <input className="form-control" type="text" placeholder="Disambiguation" name="disambiguation" defaultValue={performer.disambiguation} ref={register} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3">
                            <label htmlFor="gender">Gender</label>
                            <select className="form-control" name="gender" defaultValue={performer.gender} onChange={onGenderChange} ref={register}>
                                { enumOptions(GENDER) }
                            </select>
                        </div>
                        <div className="col-3">
                            <label htmlFor="birthdate">Birthdate</label>
                            <input className="form-control" type="text" placeholder="YYYY-MM-DD" name="birthdate" defaultValue={
                                    performer.birthdate === null ? '' :
                                    performer.birthdateAccuracy === 1 ? performer.birthdate : 
                                    performer.birthdateAccuracy === 2 ? performer.birthdate.slice(0,7) :
                                    performer.birthdate.slice(0,4)
                            } ref={register} />
                        </div>
                        <div className="col-3">
                            <label htmlFor="careerStart">Career Start</label>
                            <input className="form-control" type="year" placeholder="Year" name="careerStart" defaultValue={performer.careerStart} ref={register} />
                        </div>
                        <div className="col-3">
                            <label htmlFor="careerEnd">Career End</label>
                            <input className="form-control" type="year" placeholder="Year" name="careerEnd" defaultValue={performer.careerEnd} ref={register} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-3">
                            <label htmlFor="height">Height <small className="text-muted">in cm</small></label>
                            <input className="form-control" type="number" placeholder="Height" name="height" defaultValue={performer.height} ref={register} />
                        </div>
                        <div className="col-2">
                            <label htmlFor="cupSize">Bra size</label>
                            <input className="form-control" type="text" placeholder="Bra" name="cupSize" defaultValue={performer.bandSize !== null ? performer.bandSize + performer.cupSize : ''} ref={register({pattern: /\d{2,3}[a-zA-Z]{1,4}/i})} />
                        </div>
                        <div className="col-2">
                            <label htmlFor="waistSize">Waist-size</label>
                            <input className="form-control" type="number" placeholder="Waist" name="waistSize" defaultValue={performer.waistSize} ref={register} />
                        </div>
                        <div className="col-2">
                            <label htmlFor="hipSize">Hip-size</label>
                            <input className="form-control" type="number" placeholder="Hip" name="hipSize" defaultValue={performer.hipSize} ref={register} />
                        </div>
                        { (gender == 'female' || gender == 'transfemale') && (
                            <div className="col-3">
                                <label htmlFor="boobJob">Breast-type</label>
                                <select className="form-control" name="boobJob" defaultValue={performer.boobJob ? 'augmented' : 'natural'} ref={register}>
                                    { enumOptions(BREAST) }
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="form-group row">
                        <div className="col-6">
                            <label htmlFor="countryId">Nationality</label>
                            <Select
                                name="countryId"
                                onChange={onSelectChange.bind(null, "countryId")}
                                options={countryObj}
                                defaultValue={ countryObj.find(c => c.value == performer.countryId) }
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="ethnicity">Ethnicity</label>
                            <select className="form-control" name="ethnicity" defaultValue={getEnumValue(ETHNICITY, performer.ethnicity)} ref={register}>
                                { enumOptions(ETHNICITY) }
                            </select>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col-6">
                            <label htmlFor="location">Location</label>
                            <input className="form-control" type="text" placeholder="Location" name="location" defaultValue={performer.location} ref={register} />
                        </div>
                        <div className="col-3">
                            <label htmlFor="eyeColor">Eye color</label>
                            <select className="form-control" name="eyeColor" defaultValue={getEnumValue(EYE, performer.eyeColor)} ref={register}>
                                { enumOptions(EYE) }
                            </select>
                        </div>
                        <div className="col-3">
                            <label htmlFor="hairColor">Hair color</label>
                            <select className="form-control" name="hairColor" defaultValue={getEnumValue(HAIR, performer.hairColor)} ref={register}>
                                { enumOptions(HAIR) }
                            </select>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col-6">
                            <label htmlFor="tattoos">Tattoos <small className="text-muted">separated by <em>;</em></small></label>
                            <input className="form-control" type="text" placeholder="Tattoos" name="tattoos" defaultValue={(performer.tattoos || []).join('; ')} ref={register} />
                        </div>
                        <div className="col-6">
                            <label htmlFor="piercings">Piercings <small className="text-muted">separated by <em>;</em></small></label>
                            <input className="form-control" type="text" placeholder="Piercings" name="piercings" defaultValue={(performer.piercings || []).join('; ')} ref={register} />
                        </div>
                    </div>

                    <div className="form-group">
                        <input className="btn btn-primary col-2 save-button" type="submit" value="Save" />
                        <input className="btn btn-secondary offset-6 reset-button" type="reset" />
                        <Link to={performer.uuid ? `/performer/${performer.uuid}` : '/performers'}>
                            <button className="btn btn-danger reset-button" type="button">Cancel</button>
                        </Link>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-group">
                        <label htmlFor="photoUrl">Photo URL</label>
                        <input type="url" className="form-control" name="photoUrl" onChange={onURLChange} defaultValue={performer.photoUrl} ref={register} />
                    </div>
                    <img src={photoURL} />
                </div>
            </div>
        </form>
    );
};

export default PerformerForm;
