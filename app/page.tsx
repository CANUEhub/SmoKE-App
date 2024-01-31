"use client";

import { useEffect } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import ThemeClient from "./ui/themeClient";
import { useRouter } from 'next/navigation'
import classes from "./page.module.css";



export default function Home() {

  const router = useRouter();


  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push('/auth');
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
