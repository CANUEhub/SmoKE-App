import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Slider from "@mui/material/Slider";
import { intlFormat } from "date-fns";


export default function ForecastCard({ settlementName, time, pm25, aqhi, precip, temp }) {
    const theme = useTheme();


    return (
                    <Card variant="outlined" sx={{ display: 'flex', m: 1}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                            <Typography sx={{ fontSize: 11 }} variant="h6">
                                {settlementName}
                            </Typography>
                            <Typography sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
                                {time}
                            </Typography>
                            </CardContent>
                        
                        <Box sx={{ display: 'flex'}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                {pm25}
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                PM 2.5
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                {aqhi}
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                AQHI
                            </Typography>
                        </CardContent>

                        </Box>
                        </Box>
                    <Box>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                {precip}
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                mm/day
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                {temp}C
                            </Typography>
                        </CardContent>
                        </Box>
                    </Card>
    );
}