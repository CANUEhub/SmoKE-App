import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import community_names from "../../public/data/community_names.json";


export default function Dropdown({ onChildStateChange, onMap=true, currentCommunity=""}) {
    const [community, setCommunity] = useState('');

    const communities = community_names;

    const onMapStyles = { width: 350, position: 'absolute', left: '1vw', top: '7rem', background: 'white', zIndex:2 };

    const offMapStyles = { maxWidth: 350 , paddingBottom:10, margin:"0 1rem" };


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
        renderInput={(params) => {
          return <TextField {...params}
          label={ onMap ? (""):("Settlement")}
          placeholder="Select..."
          InputProps={{ ...params.InputProps}} />
        }}
        onChange={(event: any, newValue) => {
          handleCommunityChange(newValue);
        }}
      />
         </div>
  );
}