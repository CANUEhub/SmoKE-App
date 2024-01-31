import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import community_names from "../../public/data/community_names.json";


export default function Dropdown({ onChildStateChange, onMap=true}) {
    const [community, setCommunity] = useState('');

    const communities = community_names;

    const onMapStyles = { width: 400, position: 'absolute', left: '5vh', top: '10vh', background: 'white', zIndex:2 };

    const offMapStyles = { width: 400 };


      const handleCommunityChange = (newValue) => {

        if(newValue === null){
          return;
        }
        
        console.log("newValue", newValue.id);
        const communityID = newValue.id;
        setCommunity(communityID);
        // Invoke the callback provided by the parent
        onChildStateChange(communityID);
      };
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={communities}
      sx={ onMap ? (onMapStyles):(offMapStyles)}
      getOptionKey={(option) => option.id}
      renderInput={(params) => {
        return <TextField {...params}
        label=""
        placeholder="Search..."
        InputProps={{ ...params.InputProps}} />
      }}
      onChange={(event: any, newValue) => {
        handleCommunityChange(newValue);
      }}
    />
  );
}