import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socketId, setSocketId] = useState('');
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [codeList, setCodeList] = useState([]);

  const socket = io('http://localhost:3000');

  useEffect(() => {
    console.log('I am running');

    socket.on('connect', () => {
      console.log('connect ho gya', socket.id);
      setSocketId(socket.id);
    });

    socket.on('receive-message', (data) => {
      console.log(data);
      setMessageList([...messageList, data]);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { room, message });
    setMessage('');
  };


  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 50 }} />
      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} label="message" />
        <TextField value={room} onChange={(e) => setRoom(e.target.value)} label="room" />
        <Button className="pt-3" color="primary" type="submit" variant="contained">
          Submit
        </Button>
      </form>
      <Stack>
        {messageList.map((m, i) => (
          <Typography variant="h5" component="div" gutterBottom key={i}>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
