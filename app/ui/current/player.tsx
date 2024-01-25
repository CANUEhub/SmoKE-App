import * as React from 'react';
import { useTheme } from '@mui/material/styles';
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
import {intlFormat} from "date-fns";

const date_options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
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

  const marks = [
    {
      value: 0,
      label: `${intlFormat(new Date(timeStamps[0]), date_options)}`,
    },
    {
      value: 61,
      label: `${intlFormat(new Date(timeStamps[61]), date_options)}`,
    },
  ];

  return (
    <Card sx={{ position:'absolute',left: '25vw', right: '25vw', marginLeft: 'auto', marginRight:'auto', bottom: '0vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        {currentSeconds < totalSeconds ?
          <Typography component="div" variant="h6">
            
            {intlFormat(new Date(timeStamps[currentSeconds]), date_options)}
          </Typography> : 
                    <Typography component="div" variant="h6">
            
                  Time Unavailable
                  </Typography>
          }
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Slider
            sx={{width: '40vw'}}
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