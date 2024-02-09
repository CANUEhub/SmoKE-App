"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const modifiedTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#333333',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', // Set the background color for the Card
        },
      },
    },
  },
});



export default function ThemeClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={modifiedTheme}>
      {children}
    </ThemeProvider>
  )
} 