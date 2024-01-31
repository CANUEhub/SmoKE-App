import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import MasksIcon from '@mui/icons-material/Masks';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

import CloseIcon from '@mui/icons-material/Close';
import ForecastCard from './forecastCard';
import CircularProgress from '@mui/material/CircularProgress';

const drawerWidth = 500;

const LAYER_TYPES = {
    pm25:'pm25',
    aqhi:'aqhi',
    temp:'temp',
    precip:'precip',
    burn:'burn'
}

export default function LayerButtons({ layerChange, layerType }) {
    const theme = useTheme();

    return (
        <div style={{ position:"absolute", top:"10vh", left:'50%', transform:"translateX(-50%)"  }} >
        <ButtonGroup sx={{background:'white'}} variant="outlined" aria-label="Layer selection button group">

        <IconButton 
            aria-label="Enable Historical PM2.5 layer" 
            onClick={() => layerChange(LAYER_TYPES.pm25)}
            color={layerType === LAYER_TYPES.pm25 ? ('success'):('default')}>
            <FilterDramaIcon></FilterDramaIcon>
        </IconButton>
        <IconButton 
            aria-label="Enable Historical AQHI layer" 
            onClick={() => layerChange(LAYER_TYPES.aqhi)}
            color={layerType === LAYER_TYPES.aqhi ? ('success'):('default')}>
            <MasksIcon></MasksIcon>
        </IconButton>
        <IconButton 
            aria-label="Enable Historical Temperature layer" 
            disabled={true} 
            onClick={() => layerChange(LAYER_TYPES.temp)}>
            <ThermostatIcon></ThermostatIcon>
        </IconButton>
        <IconButton 
            aria-label="Enable Historical Precipitation layer" 
            disabled={true} 
            onClick={() => layerChange(LAYER_TYPES.precip)}>
            <ThunderstormIcon></ThunderstormIcon>
        </IconButton>
        <IconButton 
            aria-label="Enable Historical Burn composite layer" 
            disabled={true} 
            onClick={() => layerChange(LAYER_TYPES.burn)}>
            <LocalFireDepartmentIcon></LocalFireDepartmentIcon>
        </IconButton>
            </ButtonGroup>
        </div>
    );
}