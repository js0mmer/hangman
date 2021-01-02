import React from 'react';
import svg0 from '../images/0.svg';
import socketClient from 'socket.io-client';
import { RouteComponentProps } from 'react-router-dom';
import { config } from '../config';

function Letter(n: number, letter?: string) {
  return (
    <div key={n} className="letter">
      <div>{letter}</div>
    </div>
  );
}

interface IMsgProps {
  data: IChatObject
}

function Message(props: IMsgProps) {
  let color = props.data.color;
  return (
    <li className="message"><span className="username" style={{ color }}>{props.data.username}</span>{props.data.message}</li>
  );
}

interface ILogProps {
  correct: boolean
}

function Log(props: ILogProps) {
  return (
    <li className="log">{props.correct ? 'Correct' : 'Wrong guess'}</li>
  );
}

interface IChatObject {
  username: string,
  color: string,
  message: string
}

interface IGuess {
  letter: string,
  index: number
}

interface MatchParams {
  id: string
}

interface IProps extends RouteComponentProps<MatchParams> {}

interface IState {
  roomId: number,
  wordLength: number,
  letterElements: JSX.Element[],
  knownLetters: string[],
  socket: SocketIOClient.Socket
}

class Room extends React.Component<IProps, IState> {
  readonly state: IState = { roomId: 0, wordLength: 5, letterElements: [], knownLetters: [], socket: socketClient(config.serverURL) };
  private chatInput = React.createRef<HTMLInputElement>();
  private messages = React.createRef<HTMLUListElement>();

  renderLetters() {
    let letterElements: JSX.Element[] = [];
    for (let i = 0; i < this.state.wordLength; i++) {
      letterElements.push(Letter(i, this.state.knownLetters[i]));
    }

    this.setState({ letterElements });
  }

  componentDidMount() {
    this.renderLetters();

    let roomId = Number.parseInt(this.props.match.params.id);

    this.setState({ roomId });

    this.state.socket.on('chat', (data: IChatObject) => {
      if (this.messages.current === null) return;
      this.messages.current.innerHTML += <Message data={data} />;
    });

    this.state.socket.on('newLetter', (data: IGuess) => {
      let knownLetters = this.state.knownLetters;
      knownLetters[data.index] = data.letter;
      this.setState({ knownLetters });
      this.renderLetters();
    });

    this.state.socket.on('connect', () => {
      // TODO: get stuff (word length, etc.)
    });

    this.state.socket.connect();
  }

  keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.chatInput.current !== null && this.chatInput.current.value !== "") {
      let message: string = this.chatInput.current.value;
      this.chatInput.current.value = "";

      // TODO: figure out how to get server to know username/user id and color

      this.state.socket.emit('chat', { message });
    }
  };

  render() {
    return(
      <div className="room row">
        <div className="col-md-4">
          <ul className="pages">
            <li className="chat">
              <div>
                <ul className="messages" ref={this.messages}>
                  <Message data={{ username: "jacob", color: "rgb(59, 136, 235)", message: "e" }} />
                  <Log correct={true} />
                </ul>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Guess here..." onKeyDown={this.keyDown} ref={this.chatInput} />
                <span className="underline"></span>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-xs-4">
          <div className="container">
            <img src={svg0} id="img" alt="Hangman" /><br />
            {this.state.letterElements.map(item => item)}
          </div>
        </div>
        <div className="col-xs-4">
          <div className="container">
            <h1 id="wrong-letters">EA</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Room;