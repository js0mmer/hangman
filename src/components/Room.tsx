import React from 'react';
import svg0 from '../images/0.svg';
import svg1 from '../images/1.svg';
import svg2 from '../images/2.svg';
import svg3 from '../images/3.svg';
import svg4 from '../images/4.svg';
import svg5 from '../images/5.svg';
import svg6 from '../images/6.svg';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import socket from '../client';
import Username from './Username';

function Letter(n: number, letter?: string) {
  return (
    <h1 key={n} className="letter">
      {letter}
    </h1>
  );
}

function Message(props: { data: ChatObject }) {
  return (
    <li className="message"><span className="username">{props.data.username}</span>{props.data.letter}</li>
  );
}

function Log(props: {  message: string }) {
  return (
    <li className="log">{props.message}</li>
  );
}

function StartButton(props: { isHost: boolean, onClick: (event: React.MouseEvent<HTMLSpanElement>) => void, gameStarted: boolean }) {
  if (props.isHost && !props.gameStarted) {
    return <span className="button button-small" onClick={props.onClick}>Start</span>
  } else {
    return null;
  }
}

interface ChatObject {
  username: string,
  letter: string,
  indices: number[],
  result?: boolean
}

interface MatchParams {
  id: string
}

interface IProps extends RouteComponentProps<MatchParams> {}

interface IState {
  roomId: string,
  wordLength: number,
  letterElements: JSX.Element[],
  knownLetters: { [index: number]: string },
  needsUsername: boolean,
  username: string,
  isHost: boolean,
  gameStarted: boolean,
  isTurn: boolean,
  chat: JSX.Element[],
  kick: boolean,
  svg: number
}

export enum RoomStatus {
  STARTED = 'STARTED',
  INVALID = 'INVALID',
  OKAY = 'OKAY'
}

const svgs = [svg0, svg1, svg2, svg3, svg4, svg5, svg6];

class Room extends React.Component<IProps, IState> {
  readonly state: IState = {
    roomId: '', wordLength: 0, letterElements: [], knownLetters: {},
    needsUsername: true, username: '', isHost: false, gameStarted: false,
    isTurn: false,
    chat: [<Log key={0} message="Please wait for the host to start the game" />],
    kick: false, svg: 0 };
  private chatInput = React.createRef<HTMLInputElement>();
  private messages = React.createRef<HTMLUListElement>();
  private wrongLetters = React.createRef<HTMLHeadingElement>();

  renderLetters() {
    let letterElements: JSX.Element[] = [];
    for (let i = 0; i < this.state.wordLength; i++) {
      letterElements.push(Letter(i, this.state.knownLetters[i] ? this.state.knownLetters[i] : ''));
    }

    this.setState({ letterElements });
  }

  componentDidMount() {
    this.renderLetters();

    let roomId = this.props.match.params.id;

    this.setState({ roomId });

    socket.on('room_status', (status: RoomStatus) => {
      switch(status) {
        case RoomStatus.STARTED:
          alert('Game already started!');
          this.setState({ kick: true });
          break;
        case RoomStatus.INVALID:
          alert('Game does not exist!');
          this.setState({ kick: true });
          break;
      }
    });

    socket.on('guess', (data: ChatObject) => {
      this.addMessage(data);

      switch (data.result) { // if correct then fill in blanks
        case true:
          let knownLetters = this.state.knownLetters;
          console.log(data.indices);

          for (var i = 0; i < data.indices.length; i++) {
            knownLetters[data.indices[i]] = data.letter;
          }
          console.log(knownLetters);
          this.setState({ knownLetters });
          this.renderLetters();
          this.addLog('Correct!');
          break;
        case false: // if wrong, add to wrong letters
          if (this.wrongLetters.current == null) return;
          this.wrongLetters.current.innerHTML += data.letter;
          this.setState({ svg: this.state.svg + 1 });
          this.addLog('Nope');
          break;
        default:
          this.addLog('Already guessed!');
      }
    });

    socket.on('is_host', () => {
      this.setState({ isHost: true, chat: [] });
      this.addLog('Start the game when you are ready');
    })

    socket.on('start_game', () => {
      this.addLog('The game has begun');

      this.setState({ gameStarted: true })
    });

    socket.on('is_turn', (log: boolean) => {
      if (log) {
        this.addLog("It's your turn");
      }

      this.setState({ isTurn: true });
    });

    socket.on('turn_end', () => {
      this.setState({ isTurn: false });
    });

    socket.on('win', () => {
      // TODO: win message + kick to menu
      this.setState({ kick: true });
    });

    socket.on('lose', () => {
      // TODO: lose message + kick to menu
      this.setState({ kick: true });
    });

    socket.on('word_length', (wordLength: number) => {
      this.setState({ wordLength });
      this.renderLetters();
    });

    socket.on('no_players', () => {
      alert("Can't start game without any players");
    });

    socket.on('connect', () => {
      socket.emit('join_room', roomId);
    });

    if (!socket.connected) {
      socket.connect();
      // socket.io.connect();
    } else {
      socket.emit('join_room', roomId)
    }
  }

  componentWillUnmount() {
    socket.removeAllListeners();
    socket.disconnect();
  }

  addLog(message: string) {
    let i = this.state.chat.length;
    let chat = this.state.chat;
    chat.push(<Log key={i} message={message} />);
    this.setState({ chat });
  }

  addMessage(data: ChatObject) {
    let i = this.state.chat.length;
    let chat = this.state.chat;

    chat.push(<Message key={i} data={data} />);
    this.setState({ chat });
  }

  keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.chatInput.current !== null && this.chatInput.current.value !== "") {
      let message: string = this.chatInput.current.value;
      this.chatInput.current.value = "";

      socket.emit('guess', message);
    }
  };

  onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target.value.match(/^[a-zA-Z]+$/) || e.target.value === '') && e.target.value.length <= 16) {
      this.setState({ username: e.target.value });
    }
  };

  submitUsername = () => {
    socket.emit('username', { roomId: this.state.roomId, name: this.state.username });
    this.setState({ needsUsername: false });
  };

  startGame = () => {
    socket.emit('start_game');
  };

  render() {
    if (this.state.kick) {
      return <Redirect to="/" />;
    } else if (this.state.needsUsername) {
      return <Username username={this.state.username} onUsernameChange={this.onUsernameChange} submitUsername={this.submitUsername} />;
    } else {
      return (
        <div className="room row">
          <div className="col-md-4">
            <div className="chat rounded-card">
              <div>
                <ul className="messages" ref={this.messages}>
                  {this.state.chat.map(item => item)}
                </ul>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Guess here..." onKeyDown={this.keyDown} ref={this.chatInput} disabled={!this.state.gameStarted || this.state.isHost || !this.state.isTurn} />
                <span className="underline"></span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="container">
              <img src={svgs[this.state.svg]} id="img" alt="Hangman" /><br />
              <div className="row letters-wrapper">
                {this.state.letterElements.map(item => item)}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="container">
              <StartButton isHost={this.state.isHost} gameStarted={this.state.gameStarted} onClick={this.startGame} />
              {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
              <h1 id="wrong-letters" ref={this.wrongLetters}></h1>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Room;