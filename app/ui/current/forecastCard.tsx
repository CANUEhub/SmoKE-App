import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { intlFormat } from "date-fns";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Icon from '@mdi/react';
import { mdiTemperatureCelsius } from '@mdi/js';
import { mdiWeatherLightning } from '@mdi/js';
import AqhiTypography from './aqhiTypography';
import Pm25Typography from './pm25Typography';


export default function ForecastCard({ settlementName, time, pm25, aqhi, precip, temp }) {
    const theme = useTheme();
    const VALUE_FONT_SIZE = "2rem";

    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        '& .MuiTooltip-arrow': {
            color: 'white', // Change the color of the arrow here
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'white',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 250,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
            textAlign: "center"
        },
    }));

    return (
        <Card variant="outlined" sx={{ display: 'flex', m: 1, height: "70%", border: "none", boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ paddingBottom: 0, paddingTop: "0.5rem" }}>
                <Tooltip title={settlementName} arrow placement="top">
                    <Typography sx={{ 
                        fontSize: 15, 
                        fontWeight: "bold",
                        maxWidth: '7rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        }} 
                        variant="h6">
                        {settlementName}
                    </Typography>
                    </Tooltip>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {time} | Daily Max.
                    </Typography>
                </CardContent>

                <Box sx={{ display: 'flex' }}>
                    <CardContent sx={{ paddingTop: 0 }}>
                        {/* <Typography sx={{ fontSize: VALUE_FONT_SIZE, fontWeight: 800, lineHeight: 1 }}>
                            {pm25}
                        </Typography> */}
                        <Pm25Typography value={pm25}>
                        {pm25}
                        </Pm25Typography>
                        <Typography sx={{
                            paddingTop: 0,
                            fontSize: 12, display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            PM 2.5
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        <Typography sx={{fontSize:"1rem", fontWeight:"700"}}color="#306282">About PM 2.5</Typography>
                                       <Typography sx={{textAlign:"left", padding:'0.5rem', fontSize:"0.9rem"}}>
                                       Fine particulate matter (PM2.5) are inhalable particles about 1/25th the size of the diameter of a human hair.<br></br>  
                                    PM2.5 is emitted from wildfire smoke and smoke from wood burning and leads to a number of adverse health impacts.
                                       </Typography>
                                    </React.Fragment>
                                }
                                arrow
                                placement="top"
                            >
                                <InfoOutlinedIcon sx={{ marginLeft: "0.5rem", fontSize: "1rem", color: "#828282" }} />
                            </HtmlTooltip>
                        </Typography>
                        <Typography></Typography>
                    </CardContent>
                    <CardContent sx={{ paddingTop: 0 }}>
                        <AqhiTypography value={Number(aqhi)}>
                        {aqhi}
                        </AqhiTypography>
                        <Typography sx={{
                            paddingTop: 0,
                            fontSize: 12, display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            AQHI
                            <HtmlTooltip
                                title={
                                    <div>
                                        <Typography sx={{fontSize:"1rem", fontWeight:"700"}}color="#306282">About AQHI</Typography>
                                       <Typography sx={{textAlign:"left", padding:'0.5rem', fontSize:"0.8rem"}}>
                                       The <b>Air Quality Health Index (AQHI)</b> uses a scale to show the health risk associated with the air pollution we breathe.
<br />
The AQHI is measured on a scale ranging from 1-10+. The AQHI index values are grouped into health risk categories as shown below. These categories help you to easily and quickly identify your level of risk.
<br/>
<ul style={{paddingLeft:'1em'}}>
    <li>1-3 Low health risk</li>
    <li>4-6 Moderate health risk</li>
    <li>7-10 High health risk</li>
    <li>10 + Very high health risk</li>
</ul>



                                       </Typography>
                                    </div>
                                }
                                arrow
                                placement="top"
                            >
                                <InfoOutlinedIcon sx={{ marginLeft: "0.5rem", fontSize: "1rem", color: "#828282" }} />
                            </HtmlTooltip>
                        </Typography>
                    </CardContent>

                </Box>
            </Box>
            <Box sx={{ borderLeft: "1px solid #E0E0E0" }}>
    <CardContent sx={{ display: 'flex', gap: 0.5, alignItems: 'center', padding: '0.3rem', paddingTop:'1rem' }}>
        <Typography sx={{ alignSelf: 'flex-start' }}>
            <Icon color={'#E0E0E0'} path={mdiWeatherLightning} size={1.2} />
        </Typography>
        <Typography sx={{ fontSize: VALUE_FONT_SIZE, fontWeight: 800, lineHeight: 1 }}>
            {precip}
        </Typography>
        <Typography sx={{ paddingTop: 0, fontSize: 12, lineHeight: 1 }}>
            mm/day
        </Typography>
    </CardContent>
    <CardContent sx={{ display: 'flex', gap: 0.5, alignItems: 'center', paddingLeft:'0.1rem' }}>
        <Typography sx={{ alignSelf: 'flex-start' }}>
            <Icon color={'#E0E0E0'} path={mdiTemperatureCelsius} size={1.3} />
        </Typography>
        <Typography sx={{ fontSize: VALUE_FONT_SIZE, fontWeight: 800, lineHeight: 1 }}>
            {temp}°
        </Typography>
    </CardContent>
</Box>

        </Card>
    );
}