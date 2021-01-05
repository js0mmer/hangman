import React from 'react';
import { Link, Redirect } from "react-router-dom";
import socket from '../client';
import { RoomStatus } from './Room';


interface IState {
  code: number | undefined,
  join: boolean
}

class Home extends React.Component<{}, IState> {
  readonly state: IState = { code: undefined, join: false };

  componentDidMount() {
    socket.on('room_status', (status: RoomStatus) => {
      switch(status) {
        case RoomStatus.STARTED:
          alert('Game already started!');
          break;
        case RoomStatus.INVALID:
          alert('Game does not exist!');
          break;
        case RoomStatus.OKAY:
          this.setState({ join: true });
          break;
      }
    });

    if (!socket.connected) {
      socket.connect();
    }
  }

  handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 6) {
      this.setState({ code: Number.parseInt(e.target.value) });
    }
  }

  handleJoin = () => {
    socket.emit('join_room', this.state.code);
  };

  render() {
    if (this.state.join) {
      return <Redirect to={`/room/${this.state.code}`} />
    } else {
      return(
        <div className="title-screen">
          <div className="wrapper">
            <h1>Hangman</h1>
            <Link className="button" to="/create-room">Create Room</Link>
            <div className="join-group">
              <input type="number" name="code" min={0} max={999999} value={this.state.code} onChange={this.handleCodeChange} />
              <span className={'button' + (!this.state.code || String(this.state.code).length < 6 ? ' disabled' : '')} onClick={this.handleJoin}>Join</span>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Home;