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
import Icon from '@mdi/react';
import Button from '@mui/material/Button';
import { mdiSmoke, mdiAirFilter } from '@mdi/js';

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

const CenteredIconButton = ({ children, icon, ...props }) => {
    return (
      <Button
        {...props}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& .MuiButton-startIcon': {
            mb: 0, // Remove margin bottom from the icon
          },
        }}
        startIcon={icon}
      >
        {children}
      </Button>
    );
  };

export default function LayerButtons({ layerChange, layerType }) {
    const theme = useTheme();

    return (
        <div style={{ 
            position:"absolute", 
            top:"10vh", 
            left:'50%', 
            transform:"translateX(-50%)", 
            display:'flex',
            flexDirection:'row',
            gap:10 }} >
    <CenteredIconButton
        size='small'
        variant="contained" 
        icon={<Icon path={mdiSmoke} size={1} />}
        color={layerType === LAYER_TYPES.pm25 ? ('secondary'):('primary')}
        onClick={() => layerChange(LAYER_TYPES.pm25)}
    >
      PM2.5
    </CenteredIconButton>
    <CenteredIconButton 
        variant="contained" 
        icon={<Icon path={mdiAirFilter} size={1} />}
        color={layerType === LAYER_TYPES.aqhi ? ('secondary'):('primary')}
        onClick={() => layerChange(LAYER_TYPES.aqhi)}
    >
      AQHI
    </CenteredIconButton>
        </div>
    );
}