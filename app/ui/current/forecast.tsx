import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ForecastCard from './forecastCard';
import CircularProgress from '@mui/material/CircularProgress';

const time = {
    'today': 'Today',
    'tomorrow': 'Tomorrow',
    'overmorrow': 'Overmorow'
}


export default function Forecast({ forcastObject, settlementName, isLoading, handleClose }) {
    const theme = useTheme();


    return (
        <Card sx={{ position: 'absolute', left: '1vw', bottom:"3%", padding: '1rem', paddingTop:'0', backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(5px)', height:"70%"}}>
                    <IconButton sx={{position:'relative', float:'right'}} aria-label="Close forecast" onClick={() => handleClose()}>
                        <MinimizeIcon fontSize='large' />
                    </IconButton>
                <CardContent sx={{ display:'flex', justifyContent: 'space-between', paddingBottom:0 }}>
                    <Typography variant="h5" sx={{color: "#747474", fontWeight:"800"}}>
                        3-day Forecast
                    </Typography>


                </CardContent>
                <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <Typography sx={{color: "#747474", fontSize:12}}>
                        Last Updated
                    </Typography>
                </CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {isLoading ? (<CircularProgress color="success" />) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <ForecastCard
                            settlementName={settlementName}
                            time={time.today}
                            pm25={forcastObject.pm25_maxtoday}
                            aqhi={forcastObject.aqhi_maxtoday}
                            precip={forcastObject.prec_sumtoday}
                            temp={forcastObject.temp_maxtoday}
                        />
                        <ForecastCard
                            settlementName={settlementName}
                            time={time.tomorrow}
                            pm25={forcastObject.pm25_maxtomorrow}
                            aqhi={forcastObject.aqhi_maxtomorrow}
                            precip={forcastObject.prec_sumtomorrow}
                            temp={forcastObject.temp_maxtomorrow}
                        />
                        <ForecastCard
                            settlementName={settlementName}
                            time={time.overmorrow}
                            pm25={forcastObject.pm25_maxovermorrow}
                            aqhi={forcastObject.aqhi_maxovermorrow}
                            precip={forcastObject.prec_sumovermorrow}
                            temp={forcastObject.temp_maxovermorrow}
                        />
                    </Box>
                )}
            </Box>


        </Card>
    );
}