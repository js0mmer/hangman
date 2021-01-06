import socketIO from 'socket.io-client';

const serverURL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://js0mmer-hangman.herokuapp.com/';
const socket = socketIO(serverURL);

export default socket;