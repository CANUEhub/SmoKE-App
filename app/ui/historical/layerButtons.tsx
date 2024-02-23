import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Icon from '@mdi/react';
import Button from '@mui/material/Button';
import { mdiSmoke, mdiAirFilter } from '@mdi/js';

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