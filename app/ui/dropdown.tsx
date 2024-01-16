import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import community_names from "../../public/data/community_names.json";


export default function Dropdown({ onChildStateChange }) {
    const [community, setCommunity] = useState('');

    const communities = community_names;


      const handleCommunityChange = (newValue) => {

        if(!newValue){
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
      sx={{ width: 400 }}
      getOptionKey={(option) => option.id}
      renderInput={(params) => {
        return <TextField {...params}
        label=""
        placeholder="Search City"
        InputProps={{ ...params.InputProps,
          startAdornment: ( <InputAdornment position="start"> <SearchIcon color="black" />
          </InputAdornment> )}} />
      }}
      onChange={(event: any, newValue) => {
        handleCommunityChange(newValue);
      }}
      
    />
  );
}