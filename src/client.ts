import socketIO from 'socket.io-client';

const serverURL = 'http://localhost:4000';
const socket = socketIO(serverURL);

export default socket;