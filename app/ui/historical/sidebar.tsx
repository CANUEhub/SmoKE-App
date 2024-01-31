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
import { BarChart } from '@mui/x-charts/BarChart';
import LayerTypes from '../../../public/data/raster_data.json'
import Dropdown from '../dropdown';

const drawerWidth = 400;

export default function Sidebar({ isOpen, layerType, onYearChange, yearArray, dropdown, communityName, isLoading = false, }) {
    const theme = useTheme();
    const [year, setYear] = React.useState('');
    const handleYearChange = (evt) => {

        if (!evt.target.value) {
            return;
        }
        const newYear = evt.target.value;
        setYear(newYear);
        console.log("Year change sidebar", newYear);
        onYearChange(newYear);
    };
    const layer = LayerTypes.find((hist) => hist.id === layerType);



    return (
        <Drawer
            variant="persistent"
            sx={{
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', zIndex: 1 },
            }}
            open={isOpen}
        >
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 20 }}>
                <Dropdown onChildStateChange={dropdown} onMap={false} />
                {yearArray ? (

                    <FormControl sx={{width:350, margin:'0 auto'}}>
                        <InputLabel  id="demo-simple-select-label">Year</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={year}
                            label="Year"
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
                            value={year}
                            label="Year"
                            sx={{ width: drawerWidth }}
                            onChange={handleYearChange}
                            disabled={true}
                        >
                        </Select>
                    </FormControl>

                )}
                <Typography sx={{ fontSize: 18, margin:'0 auto', padding:2 }} variant="h2">
                    {communityName}
                </Typography>
            </Box>
            <Box>
                {isLoading ? (
                    <CircularProgress/>    
                ):(
                    <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Community', 'National', 'Provincial'] }]}
                    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }]}
                    width={drawerWidth*0.9}
                    height={drawerWidth*0.75}
                  />
                )}

            </Box>
        </Drawer>
    );
}