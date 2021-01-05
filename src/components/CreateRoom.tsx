import React from 'react';
import { Redirect } from 'react-router-dom';
import socket from '../client';

interface IState {
  word: string,
  code: string
}

class CreateRoom extends React.Component<{}, IState> {
  readonly state: IState = { word: '', code: '' }

  componentDidMount() {
    socket.on('room_code', (code: string) => {
      this.setState({ code });
    });

    if (!socket.connected) {
      socket.connect();
    }
  }

  componentWillUnmount() {
    socket.off('room_code');
  }

  onWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-zA-Z]+$/) || e.target.value === '') {
      this.setState({ word: e.target.value });
    }
  }

  submit = () => {
    socket.emit('create_room', this.state.word);
  }

  render() {
    if (this.state.code !== '') {
      return <Redirect to={`/room/${this.state.code}`} />;
    } else {
      return(
        <div className="create-room container">
          <div className="rounded-card">
            <h3 className="heading">Enter a word</h3>
            <div>
              <div className="word-input">
                <input type="text" placeholder="Type here..." maxLength={16} size={16} value={this.state.word} onChange={this.onWordChange} />
                <span className="underline"></span>
              </div>
              <span className={'button button-small' + (this.state.word === '' ? ' disabled' : '')} style={{ display: 'inline' }} onClick={this.submit}>Submit</span>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default CreateRoom;