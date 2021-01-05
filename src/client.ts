import socketIO from 'socket.io-client';

const serverURL = 'https://js0mmer-hangman.herokuapp.com:4000';
const socket = socketIO(serverURL);

export default socket;