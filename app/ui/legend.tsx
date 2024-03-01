import React from 'react';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';

interface Threshold {
  threshold: string;
  color: string;
}

interface LegendProps {
  thresholds: Threshold[];
  unit: string;
  historical: boolean;
}

const StyledLegend = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin:'0 auto',
  marginTop: '16px',
  width: '100%',
  padding:'0 10px',
  gap:'1rem',
  overflow: 'hidden', // Hide overflowing rounded corners of the first and last segment
  borderRadius: '10px', // Rounded corners for the legend container
});

const SegmentWrapper = styled('div')({
  display: 'flex',
  flex: 1,
  position: 'relative', // Add position relative to position the labels
});

const Segment = styled('div')({
  height: '20px',
  flex: 1,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const FirstSegment = styled(Segment)({
  borderTopLeftRadius: '10px',
  borderBottomLeftRadius: '10px',
});

const LastSegment = styled(Segment)({
  borderTopRightRadius: '10px',
  borderBottomRightRadius: '10px',
});

const MiddleSegment = styled(Segment)({
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0',
  borderTopRightRadius: '0',
  borderBottomRightRadius: '0',
});

const Label = styled('div')({
  fontSize: '1rem',
});

// const LegendContainer = styled('div')({
//     width: '50%',
//     height: '50px',
//     backgroundColor: 'rgba(255, 255, 255, 0.6)', 
//     backdropFilter: 'blur(5px)',
//     position: 'absolute',
//     bottom: '23%',
//     left: {historical?}'50%',
//     transform: 'translate(-50%, -50%)',
//     borderRadius: '10px'

//   });

const currentStyle = {
  width: '50%',
  height: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.6)', 
  backdropFilter: 'blur(5px)',
  position: 'absolute',
  bottom: '23%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '10px'
};

const historicalStyle ={
  width: '50%',
  height: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.6)', 
  backdropFilter: 'blur(5px)',
  position: 'absolute',
  bottom: '200px',
  left:'65%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '10px'
}


const Legend: React.FC<LegendProps> = ({ thresholds, unit, historical }) => {
  const legendStyle = historical ? historicalStyle : currentStyle;
  return (
    <div style={legendStyle}>
    <StyledLegend>
        <Typography>{unit}</Typography>
      <SegmentWrapper>
        {thresholds.map((threshold, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
                <FirstSegment style={{ backgroundColor: thresholds[0].color }}>
                  <Label>{threshold.threshold}</Label>
              </FirstSegment>
            ) : index === thresholds.length - 1 ? (
              <LastSegment style={{ backgroundColor: threshold.color }}>
                <Label>{threshold.threshold}</Label>
              </LastSegment>
            ) : (
              <MiddleSegment style={{ backgroundColor: threshold.color }}>
                <Label>{threshold.threshold}</Label>
              </MiddleSegment>
            )}
          </React.Fragment>
        ))}
      </SegmentWrapper>
    </StyledLegend>
    </div>
  );
};

export default Legend;
