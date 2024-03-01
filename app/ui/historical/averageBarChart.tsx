import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarChart  } from '@mui/x-charts/BarChart';

const drawerWidth = 500;

const LAYER_TYPES_HEADING = {
    pm25: 'ANNUAL PM 2.5 COMPARISON, ',
    aqhi: 'ANNUAL AQHI COMPARISON,',
    temp: 'ANNUAL TEMPERATURE COMPARISON,',
    precip: 'ANNUAL PRECIPITATION COMPARISON,',
    burn: 'ANNUAL PM 2.5 COMPARISON,'
}

export default function AverageBarChart({ yearValue, layerType, barData }) {
    const theme = useTheme();

    const communityYearAvgVar = layerType =='pm25' ? 'hcaco_pm25_avg' : 'hcaaqhi_avg';
    return (
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
                        { label: 'Year Avg',data: [Number(barData[`${communityYearAvgVar}`]), Number(barData['haacanval']), Number(barData['haavalue'])] },
                        { label: 'Long term Avg', data: [Number(barData['hclval']), Number(barData['halcanval']), Number(barData['halval'])] }]}
                    width={drawerWidth * 0.9}
                    height={drawerWidth * 0.75}
                >
                    
                </BarChart>

                
            </Box>
    </Box>
    );
}