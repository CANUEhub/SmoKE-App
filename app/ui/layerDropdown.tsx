import * as React from 'react';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LayerTypes from '../../public/data/raster_data.json'


export default function LayerDropdown({ onChildStateChange }) {
    const [layerID, setLayerID] = useState('');
    const [layerYear, setLayerYear] = useState(0);

    const LayerList = LayerTypes;

      const handleLayerChange = (newValue) => {

        if(!newValue){
          return;
        }
        setLayerID(newValue);
        console.log("newValue", newValue);
        onChildStateChange(layerID);
      };


  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel htmlFor="grouped-native-select">Raster Layer</InputLabel>
        <Select native 
            id="grouped-native-select" 
            label="Raster Layer"
            value={layerID}
            onChange={(event: any, newValue) => {
                console.log('hit', event.target.value)
                handleLayerChange(event.target.value);
              }}>
          <option aria-label="None" value="" />
          {LayerList.map((layer,index) => (
            <optgroup key={index} label={layer.name}>
            {layer.years.map((year,index) => (
                <option key={index} value={`${layer.id} ${year}`}>{year}</option>
            ))}
            </optgroup>
          ))}
        </Select>
      </FormControl>

    </div>
  );
}