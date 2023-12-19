import React from 'react';
import { useState, useEffect } from 'react';
import "chart.js/auto";   
import { Bar } from 'react-chartjs-2';
import { BarChart } from '@mui/x-charts/BarChart';
import canossempm25data from "../../public/data/2010_2022_canossem_pm25.json";

interface chartData {
    labels: any;
    datasets: any;
  }

export default function PM25Chart({...props}) {
    const [community, setCommunity] = useState({...props.community});
    const [chartData, setChartData] = useState<any>([0]);
    const pm25Data = canossempm25data;
    const labels = pm25Data.labels
    useEffect(() => {
        setCommunity(props.community);
        setChartData(pm25Data.datasets.find((comm) => {
            return comm.label == props.community  ;
        })?.data
    
    );
    }, [props.community, props.chartData])


    // setChartData({labels, dataset});
    console.log("chartData", chartData)

if (!community){
    return (
        <div>no community selected</div>
    )
} else {
  return (
    
    <BarChart
      xAxis={[
        {
          data: labels,
          scaleType: 'band',
        },
      ]}
      series={[
        {
          data: chartData,
          label: "PM2.5"
        }
      ]}
      width={500}
      height={300}
    />
  );
    }
}