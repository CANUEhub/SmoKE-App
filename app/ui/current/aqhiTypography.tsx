import React from 'react';
import Typography from '@mui/material/Typography';

const VALUE_FONT_SIZE = "2rem";
const getColorForValue = (value) => {
  switch (value) {
    case 1:
      return '#00CCFF';
    case 2:
      return '#0099CC';
    case 3:
      return '#006699';
    case 4:
      return '#FFFF00';
    case 5:
      return '#FFCC00';
    case 6:
      return '#FF6666';
    case 7:
      return '#FF0000';
    case 8:
      return '#CC0000';
    default:
      return '#990000'; // For values 9 and above
  }
};

const AqhiTypography = ({ value, children }) => {
  const color = getColorForValue(value);

  return (
    <Typography style={{ color }} sx={{ fontSize: VALUE_FONT_SIZE, fontWeight: 800, lineHeight: 1 }}>
      {children}
    </Typography>
  );
};

export default AqhiTypography;