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
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 30 }}>
                <Dropdown onChildStateChange={dropdown} onMap={false} />
                {yearArray ? (

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Year</InputLabel>
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
                            sx={{ width: 400 }}
                            onChange={handleYearChange}
                            disabled={true}
                        >
                        </Select>
                    </FormControl>

                )}
                <Typography sx={{ fontSize: 13 }} variant="h2">
                    {communityName}
                </Typography>
            </Box>
        </Drawer>
    );
}