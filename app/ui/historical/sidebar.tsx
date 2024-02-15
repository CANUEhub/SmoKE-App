import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ForecastCard from './forecastCard';
import CircularProgress from '@mui/material/CircularProgress';
import { BarChart  } from '@mui/x-charts/BarChart';
import LayerTypes from '../../../public/data/raster_data.json'
import Dropdown from '../dropdown';

const drawerWidth = 400;
const LAYER_TYPES_HEADING = {
    pm25: 'ANNUAL PM 2.5 COMPARISON, ',
    aqhi: 'ANNUAL AQHI COMPARISON,',
    temp: 'ANNUAL TEMPERATURE COMPARISON,',
    precip: 'ANNUAL PRECIPITATION COMPARISON,',
    burn: 'ANNUAL PM 2.5 COMPARISON,'
}

export default function Sidebar({ isOpen, layerType, onYearChange, yearArray, dropdown, communityName, isLoading, yearValue, barData }) {
    const theme = useTheme();
    const [year, setYear] = React.useState('');
    const handleYearChange = (evt) => {

        if (!evt.target.value) {
            return;
        }
        const newYear = evt.target.value;
        setYear(newYear);
        onYearChange(newYear);
    };
    const layer = LayerTypes.find((hist) => hist.id === layerType);
    return (
        <Drawer
            variant="persistent"
            sx={{
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: '30%', boxSizing: 'border-box', zIndex: 1 },
            }}
            open={isOpen}
        >
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", m: 4, marginTop: 13, borderBottom: "1px solid #E0E0E0" }}>

                <InputLabel sx={{
                    fontSize: 15,
                    color: 'black',
                    fontWeight: 300
                }}>Search Communities</InputLabel>
                <Dropdown onChildStateChange={dropdown} onMap={false} communityName={communityName} />
                <InputLabel sx={{
                    fontSize: 15,
                    color: 'black',
                    fontWeight: 300
                }}>Select Year</InputLabel>
                {yearArray ? (

                    <FormControl sx={{ maxWidth: 350 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={year}
                            onChange={handleYearChange}
                            disabled={!layerType}
                        >

                            {yearArray.map((year, index) => (
                                <MenuItem key={index} value={year}>{year.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Year</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={yearValue}
                            label="Year"
                            sx={{ width: drawerWidth }}
                            onChange={handleYearChange}
                            disabled={true}
                        >
                        </Select>
                    </FormControl>

                )}
                {!layerType &&(

                <Typography color={'error'}>Please select the PM2.5 or AQHI layer above</Typography>
                )}
                <Typography sx={{ fontSize: 18, fontWeight: 900, paddingTop: '2rem', paddingBottom: '1rem' }}>
                    {communityName}
                </Typography>
            </Box>
            {barData && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        m: 4,
                        marginTop:0
                    }}>

                    <Typography variant='h6' sx={{
                        fontWeight: 700
                    }}>
                        {LAYER_TYPES_HEADING[layerType.id]} {yearValue}
                    </Typography>


                    <Typography sx={{
                        fontSize: 14
                    }}>
                        Compare community average to national and provincial averages
                    </Typography>

                    <Box sx={{display:'flex', flexDirection:'row'}}>
                        <Box 
                            sx={{
                                display:'flex',
                                flexDirection:'column',
                                m:1, 
                                marginLeft:0
                            }}
                        >
                            <Typography
                            sx={{
                                fontSize:25,
                                fontWeight:600    
                            }}>
                                {barData['hcaco_pm25_avg']}
                            </Typography>
                            <Typography
                            sx={{
                                fontSize:12,
                                color:'#BDBDBD'  
                            }}>Year Avg
                            </Typography>

                        </Box>
                        <Box 
                            sx={{
                                display:'flex',
                                flexDirection:'column',
                                m:1
                            }}
                        >
                            <Typography
                            sx={{
                                fontSize:20,
                                fontWeight:600    
                            }}>
                            {barData['hclval']}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize:12,
                                color:'#BDBDBD'  
                            }}>
                                Long term Avg 
                            </Typography>
                            <Typography
                            sx={{
                                fontSize:12,
                                color:'#BDBDBD'  
                            }}>
                                ({barData['halcanyearspan']})
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: ['Community', 'National', 'Provincial'] }]}
                                series={[
                                    { label: 'Year Avg',data: [Number(barData['hcaco_pm25_avg']), Number(barData['haacanval']), Number(barData['haavalue'])] },
                                    { label: 'Long term Avg', data: [Number(barData['hclval']), Number(barData['halcanval']), Number(barData['halval'])] }]}
                                width={drawerWidth * 0.9}
                                height={drawerWidth * 0.75}
                            >
                                
                            </BarChart>

                            
                        </Box>
                </Box>
            )}
        </Drawer>
    );
}