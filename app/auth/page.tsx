"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Check the credentials (this is just a simple example)
    if (username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD) {
      // Authentication successful
      localStorage.setItem('authenticated', 'true');
      router.push('/current'); // Redirect to the dashboard or any other page
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box>
        <Card>
            <CardContent>
            <Typography variant="h5">Login</Typography>
        <form>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
            </CardContent>
        </Card>
        
      </Box>
    </Container>
  );
};

export default AuthPage;
