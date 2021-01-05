import socketIO from 'socket.io-client';

const serverURL = 'https://js0mmer-hangman.herokuapp.com/';
const socket = socketIO(serverURL);

export default socket;