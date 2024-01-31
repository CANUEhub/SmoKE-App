import * as React from 'react';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LayerTypes from '../../public/data/raster_data2.json'


export default function LayerDropdown({ onChildLayerChange }) {
    const [layerID, setLayerID] = useState('');

    const LayerList = LayerTypes;

    const handleLayerChange = (newValue) => {

        if(!newValue){
          return;
        }
        setLayerID(newValue);
        console.log("newValue layerdropdown", newValue);
        onChildLayerChange(newValue);
    };


  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel htmlFor="grouped-native-select">Raster Layer</InputLabel>
        <Select native 
            id="grouped-native-select" 
            label="Raster Layer"
            value={layerID}
            onChange={(event: any) => {
                console.log('hit2', event.target.value)
                handleLayerChange(event.target.value);
              }}>
          <option aria-label="None" value="" />
          {LayerList.map((layer,index) => (
            <optgroup key={layer.name} label={layer.name}>
            {layer.years.map((year,index) => (
                <option key={`${layer.prefix}${year}`} value={`${layer.prefix}${year}`}>{year}</option>
            ))}
            </optgroup>
          ))}
        </Select>
      </FormControl>

    </div>
  );
}