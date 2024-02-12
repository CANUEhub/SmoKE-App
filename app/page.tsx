"use client";

import { useEffect } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import ThemeClient from "./ui/themeClient";
import { useRouter } from 'next/navigation'
import classes from "./page.module.css";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';

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

export default function Home() {

  const router = useRouter();


  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const screenWidth = window.innerWidth;
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push('/auth');
    } else if(isMobile || screenWidth < 1440) {
      router.push('/mobile');
    }
  }, []);

  return (
    <main className={classes.mainStyle}>
      <ThemeClient>
      <StyledContainer maxWidth="sm">
      <StyledMessage variant="h4">
        smokeinfo.ca is currently under construction
      </StyledMessage>
    </StyledContainer>
      </ThemeClient>
    </main>
  )
}
