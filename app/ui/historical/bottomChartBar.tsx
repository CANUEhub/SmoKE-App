import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ForecastCard from './forecastCard';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import CircularProgress from '@mui/material/CircularProgress';

const LAYER_TYPES = {
    pm25:'co_pm25_avg',
    aqhi:'aqhi',
    temp:'temp',
    precip:'precip',
    burn:'burn'
}

export default function BottomChartBar({ isOpen, isLoading, spline, layerType }) {

    const timeArray = spline.map((data)=>{
        return new Date(data.day)
    })

    const dataArray = spline.map((data)=>{
        return data[LAYER_TYPES[layerType]];
    })

    const xAxisCommon = {
        data: timeArray,
        scaleType: 'time'
      } 

    const seriesConfig = {
        type:'line',
        data: dataArray,
        showMark: false
    }

    return (
        <Card sx={{ position: 'absolute', left:400, bottom:0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width:1000, height:300 }}>
                {isLoading ? (<CircularProgress color="success" />) : (
                         <LineChart
                        xAxis={[{ ...xAxisCommon }]}
                        series={[
                            {
                                data: dataArray,
                                showMark: false
                            },
                        ]}
                        width={1000}
                        height={300}
                        /> 
                )}
            </Box>


        </Card>
    );
}