import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import CircularProgress from '@mui/material/CircularProgress';
import { compareAsc } from "date-fns";

const LAYER_TYPES = {
    pm25:'co_pm25_avg',
    aqhi:'aqhi_avg',
    temp:'temp',
    precip:'precip',
    burn:'burn'
}

const LAYER_UNITS = {
    pm25:'PM2.5 (ug/m3)',
    aqhi:'',
    temp:'temp',
    precip:'precip',
    burn:'burn'
}

const LAYER_TYPES_HEADING = {
    pm25:'ANNUAL PM 2.5 COMPARISON, ',
    aqhi:'ANNUAL AQHI COMPARISON,',
    temp:'ANNUAL TEMPERATURE COMPARISON,',
    precip:'ANNUAL PRECIPITATION COMPARISON,',
    burn:'ANNUAL PM 2.5 COMPARISON,'
}

export default function BottomChartBar({ isOpen, isLoading, spline, layerType }) {

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const timeArray = spline.map((data)=>{
        return new Date(data.day)
    }).sort(compareAsc);

    const formatDate = (date) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[date.getMonth()];
      };
    

    const dataArray = spline.map((data)=>{
        return Number(data[LAYER_TYPES[layerType]]);
    })
    const yAxisCommon = {
        label:`${LAYER_UNITS[layerType]}`,
      } 

    const xAxisCommon = {
        data: timeArray,
        scaleType: 'time',
        id: 'x-axis-id',
        hideTooltip: true,
      } 
    

    dataArray.map((x,y)=>{
        if (typeof x !=="number"){
            console.log('dataArray not num', `${x} ${y}`)
        }
    })

    return (
        <Card sx={{ position: 'absolute', width:'70%', left:'30%', bottom:0}}>


            <Box>
                <Paper sx={{width:'100%', height:200}}>

                {isLoading ? (<CircularProgress color="success" />) : (
                    <LineChart
                    yAxis={[{...yAxisCommon}]}
                    xAxis={[{ ...xAxisCommon }]}
                    series={[
                        {
                            data: dataArray,
                            showMark: false,
                            valueFormatter: (element) => `${element} ${LAYER_UNITS[layerType]}`
                        }
                    ]}
                    >
                    </LineChart>
            //                      <ResponsiveChartContainer
            //     series={[
            //     {
            //     type:"line",
            //     data: dataArray,
            //     showMark: false
            //     }
            //     ]}
            //     xAxis={[{ ...xAxisCommon }]}
            // >
            // <LinePlot/>
            // <ChartsXAxis label="Month" position="bottom" axisId="x-axis-id" />
            // <ChartsYAxis label="PM2.5 (ug/m3)" />
            // </ResponsiveChartContainer>           
                    )}
                </Paper>
            </Box>
            


        </Card>
    );
}