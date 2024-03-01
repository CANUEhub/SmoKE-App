
"use client";
import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import Legend from '../ui/legend';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const StyledMessage = styled(Typography)({
  marginBottom: '16px',
  textAlign: 'center',
});

const LowResolutionScreen: React.FC = () => {
  return (
    <StyledContainer maxWidth="sm">
      <StyledMessage variant="h4">
        This website is not optimized for mobile devices or smaller screens.
      </StyledMessage>

    </StyledContainer>
  );
};

export default LowResolutionScreen;
