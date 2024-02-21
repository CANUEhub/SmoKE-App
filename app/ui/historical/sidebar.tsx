import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { BarChart  } from '@mui/x-charts/BarChart';
import LayerTypes from '../../../public/data/raster_data.json'
import Dropdown from '../dropdown';
import AverageBarChart from './averageBarChart'

const drawerWidth = 400;
const LAYER_TYPES_HEADING = {
    pm25: 'ANNUAL PM 2.5 COMPARISON, ',
    aqhi: 'ANNUAL AQHI COMPARISON,',
    temp: 'ANNUAL TEMPERATURE COMPARISON,',
    precip: 'ANNUAL PRECIPITATION COMPARISON,',
    burn: 'ANNUAL PM 2.5 COMPARISON,'
}

export default function Sidebar({ isOpen, layerType, onYearChange, yearArray, dropdown, communityName, isLoading, yearValue, barData }) {
    const [year, setYear] = React.useState(null);

    const availableYear = yearArray.map((yr) => yr.value);
    const handleYearChange = (evt) => {
        console.log('fired', evt.target.value);
        if (!evt.target.value) {
            return;
        }
        const newYear = evt.target.value;
        setYear(newYear);
        onYearChange(newYear);
    };
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
                            displayEmpty={true}
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
                            displayEmpty={true}
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
                <AverageBarChart
                yearValue={yearValue}
                layerType={layerType}
                barData={barData}
                >
                </AverageBarChart>
            )}
        </Drawer>
    );
}