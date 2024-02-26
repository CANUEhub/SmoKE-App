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
import {intlFormat, format, parseISO} from "date-fns";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Stack from '@mui/material/Stack'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


const date_options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false
};


const time_options = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false
};

const date_options1 = {
  year: "numeric",
  month: "numeric",
  day: "numeric"
};

export default function Player({onPlaybackChange, onTimeChange, onStepChange, isPlaying, totalSeconds, currentSeconds, timeStamps}) {
  const theme = useTheme();

  const handleForward = () => {
    onPlaybackChange()
    onStepChange(currentSeconds+1)
  }

  const handleBackward = () => {
    onPlaybackChange()
    onStepChange(currentSeconds-1)
  }

  function formatDateTime(dateString) {
    const date = parseISO(dateString);

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
}



  const marks = [
    {
      value: 0,
      label: `${formatDateTime(timeStamps[0])}`,
    },
    {
      value: 70,
      label: `${formatDateTime(timeStamps[70])}`,
    },
  ];

  const CustomSlider = styled(Slider)(({ theme }) => ({
    "& .MuiSlider-markLabel": {
      whiteSpace: 'unset', 
      width: '5rem',
      textAlign: 'center'
    },
    '& .MuiSlider-track': {
      backgroundColor: '#D9D9D9', // Change the color here
      border: 'none', // Remove the blue outline
    },
    '& .MuiSlider-rail': {
      backgroundColor: '#D9D9D9', // Change the rail color here (behind the track)
    },
    '& .MuiSlider-thumb': {
      height: 20, // Adjust the height of the thumb
      width: 10, // Adjust the width of the thumb
      backgroundColor: 'black', // Change the color of the thumb
      '&:hover': {
        boxShadow: 'none', // Remove box shadow on hover
      },
      
    }
  }));

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
      textAlign:"center"
    },
  }));

  return (
    <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(5px)', position:'absolute',left: '25vw', right: '25vw', marginLeft: 'auto', marginRight:'auto', bottom: '3%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        {currentSeconds < totalSeconds ?
        <Stack direction="row" alignItems="center" gap={1}>
         
          <Typography component="span" variant="h5" sx={{ fontWeight:700 }}>
            
        {intlFormat(new Date(timeStamps[currentSeconds]), date_options1)}
      </Typography>

      <Typography component="span" sx={{ color:"#747474"}}>
      {timeStamps[currentSeconds-1].substr(11, 5)} UTC
      <HtmlTooltip
        title={
          <React.Fragment>
                                        <Typography sx={{fontSize:"1rem", fontWeight:"700"}}color="#306282">Wildfire Forecast Simulation</Typography>
                                       <Typography sx={{textAlign:"left", padding:'0.5rem', fontSize:"0.9rem"}}>
                                       Click on Play button to simulate 72 hours wildfires forecast in the area.
                                       </Typography>
          </React.Fragment>
        }
        arrow
        placement="top"
      >
        <InfoOutlinedIcon sx={{marginLeft: "0.5rem", fontSize:"1rem", color:"#828282"}}/>
      </HtmlTooltip>
      </Typography>
      </Stack>
: 
                  <Typography component="div" variant="h6">
            
                  Time Unavailable
                  </Typography>
          }
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CustomSlider
            sx={{width: '42vw', height: 12}}
            value={currentSeconds}
            color='info'
            aria-label="Timescale"
            defaultValue={0}
            valueLabelDisplay="auto"
            step={1}
            marks={marks}
            min={0}
            max={totalSeconds}
            onChange={onTimeChange}
            />

        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="Skip forward 1 hour" onClick={() => handleBackward()}>
            {currentSeconds !== 0 ? <SkipPreviousIcon /> : <SkipPreviousIcon color="disabled" />}
          </IconButton>
          <IconButton aria-label="play/pause" onClick={() => onPlaybackChange()}>
          {isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )
            }
          </IconButton>
          {currentSeconds !== totalSeconds ? <IconButton aria-label="Skip backward 1 hour" onClick={() =>  handleForward()}>
            <SkipNextIcon />
          </IconButton>: <IconButton aria-label="Skip backward 1 hour" disabled={true}>
            <SkipNextIcon />
          </IconButton>}
        </Box>
      </Box>

    </Card>
  );
}