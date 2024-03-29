import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import community_names from "../../public/data/community_names.json";


export default function Dropdown({ onChildStateChange, onMap=true, communityName}) {
    const [community, setCommunity] = useState(null);
    const [selectedCommunityName, setSelectedCommunityName] = useState(communityName); // State to store selected community name

    const communities = community_names;

    const onMapStyles = { width: 350, position: 'absolute', left: '1vw', top: '7rem', background: 'white', zIndex:2 };

    const offMapStyles = { maxWidth: 350 , paddingBottom:5 };

    useEffect(() => {
        setSelectedCommunityName(communityName); // Update the selected community name when communityName prop changes
    }, [communityName]);

    const handleCommunityChange = (newValue) => {
        if(newValue === null){
            return;
        }
        const communityID = newValue.id;
        setCommunity(communities.find((comm) => comm.id == newValue.id));
        // Invoke the callback provided by the parent
        onChildStateChange(communityID);
    };

    return (
        <div>
            {onMap && (
                <InputLabel sx={{
                    position: 'absolute',
                    top: '5rem',
                    left: '1vw',
                    backgroundColor: 'transparent',
                    padding: '0 4px',
                    color: 'black',
                    fontWeight: 600
                }}>Search Communities</InputLabel>
            )}

            <Autocomplete
                id="combo-box-demo"
                options={communities}
                sx={ onMap ? (onMapStyles):(offMapStyles)}
                getOptionKey={(option) => option.id}
                value={selectedCommunityName} // Set the value of Autocomplete to selectedCommunityName
                renderInput={(params) => {
                    return <TextField {...params}
                                      placeholder={ communityName ? (communityName):("Select...")}
                                      InputProps={{ ...params.InputProps}} />
                }}
                onChange={(event: any, newValue) => {
                    handleCommunityChange(newValue);
                }}
                freeSolo
            />
        </div>
    );
}
