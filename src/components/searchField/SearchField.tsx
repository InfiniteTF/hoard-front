import SearchQuery from '../../queries/Search.gql';
import { Search, Search_search as Result } from '../../definitions/Search';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Async from 'react-select/async';
import { debounce } from 'lodash';
import { navigate } from '@reach/router'

interface SearchFieldProps {
    onClick?: (performer:Result) => void;
}

interface SearchResult {
    label: string;
    value: Result;
}

const SearchField: React.FC<SearchFieldProps> = ({onClick}) => {
    const [selectedValue, setSelected] = useState(null);
    const [search] = useMutation<Search>(SearchQuery);

    const handleSearch = (term:String, callback:any) => {
        search({ variables: { term }}).then((result:any) => {
            const options = result.data.search && result.data.search.map((performer:Result) => (
                { value: performer, label: performer.displayName }
            ));
            callback(options)
        })
    };

    const debouncedLoadOptions = debounce(handleSearch, 400);

    const handleChange = (result:SearchResult) => {
        if(result) {
            if(onClick)
                onClick(result.value);
            else
                navigate(`/performer/${result.value.uuid}`);
        }
        setSelected(null);
    }

    return (
        <div className="SearchField">
            <Async
                value={selectedValue}
                defaultOptions
                loadOptions={debouncedLoadOptions}
                onChange={handleChange}
                placeholder="Search for performer..."
                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                noOptionsMessage={({inputValue}:{inputValue: string}):string => {return null && inputValue}}
            />
        </div>
    );
};

export default SearchField;
