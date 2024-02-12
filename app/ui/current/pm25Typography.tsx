import React from 'react';
import Typography from '@mui/material/Typography';
const VALUE_FONT_SIZE = "2rem";
const getColorForValue = (value) => {
    if (value >= 0 && value <= 10) {
      return '#00CCFF';
    } else if (value > 10 && value <= 20) {
      return '#0099CC';
    } else if (value > 20 && value <= 30) {
      return '#006699';
    } else if (value > 30 && value <= 40) {
      return '#FFFF00';
    } else if (value > 40 && value <= 50) {
      return '#FFCC00';
    } else if (value > 50 && value <= 60) {
      return '#FF6666';
    } else if (value > 60 && value <= 70) {
      return '#FF0000';
    } else if (value > 70 && value <= 80) {
      return '#CC0000';
    } else if (value > 80 && value <= 90) {
      return '#990000';
    } else {
      return '#000000'; // Default color if value is out of range
    }
  };

const Pm25Typography = ({ value, children }) => {
  const color = getColorForValue(value);

  return (
    <Typography style={{ color }} sx={{ fontSize: VALUE_FONT_SIZE, fontWeight: 800, lineHeight: 1 }}>
      {children}
    </Typography>
  );
};

export default Pm25Typography;