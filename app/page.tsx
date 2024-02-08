"use client";

import { useEffect } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import ThemeClient from "./ui/themeClient";
import { useRouter } from 'next/navigation'
import classes from "./page.module.css";



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
    } else if(isMobile || screenWidth < 1920) {
      router.push('/mobile');
    }
  }, []);

  return (
    <main className={classes.mainStyle}>
      <ThemeClient>
        <h1>smokeinfo.ca is under construction</h1>
      </ThemeClient>
    </main>
  )
}
