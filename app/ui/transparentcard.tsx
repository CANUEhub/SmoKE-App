import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

// Define custom styles
const useStyles = makeStyles({
  transparentPaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust opacity here
    boxShadow: 'none', // Remove shadow to enhance transparency effect
  },
});

const TransparentCard = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.transparentPaper}>
      <Card>

      </Card>
    </Paper>
  );
};

export default TransparentCard;