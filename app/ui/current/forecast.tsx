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


export default function Forecast({ forcastObject, settlementName }) {
    const theme = useTheme();


    return (
        <Card sx={{ position: 'absolute', left: '1vw', bottom: '5vh', padding: '1rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        3-day Forecast
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Card variant="outlined" sx={{ display: 'flex'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                            <Typography sx={{ fontSize: 11 }} variant="h6">
                                settlementName
                            </Typography>
                            <Typography sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
                                today
                            </Typography>
                            </CardContent>
                        
                        <Box sx={{ display: 'flex'}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                123
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                PM 2.5
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                234
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
                                5
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                mm/day
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                23C
                            </Typography>
                        </CardContent>
                        </Box>
                    </Card>
                    <Card variant="outlined" sx={{ display: 'flex'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                            <Typography sx={{ fontSize: 11 }} variant="h6">
                                settlementName
                            </Typography>
                            <Typography sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
                                Tomorrow
                            </Typography>
                            </CardContent>
                        
                        <Box sx={{ display: 'flex'}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                123
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                PM 2.5
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                234
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
                                5
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                mm/day
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                23C
                            </Typography>
                        </CardContent>
                        </Box>
                    </Card>
                    <Card variant="outlined" sx={{ display: 'flex'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                            <Typography sx={{ fontSize: 11 }} variant="h6">
                                settlementName
                            </Typography>
                            <Typography sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
                                Overmorrow
                            </Typography>
                            </CardContent>
                        
                        <Box sx={{ display: 'flex'}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                123
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                PM 2.5
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                234
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
                                5
                            </Typography>
                            <Typography sx={{ fontSize: 12 }}>
                                mm/day
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }}>
                                23C
                            </Typography>
                        </CardContent>
                        </Box>
                    </Card>
                </Box>
            </Box>


        </Card>
    );
}