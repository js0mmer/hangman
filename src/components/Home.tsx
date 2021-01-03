import React from 'react';
import { Link } from "react-router-dom";


interface IState {
  code: number
}

class Home extends React.Component<{}, IState> {
  readonly state: IState = { code: Number.NaN };

  handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ code: Number.parseInt(e.target.value) });
  }

  render() {
    return(
      <div className="title-screen">
        <div className="wrapper">
          <h1>Hangman</h1>
          <Link className="button" to="/create-room">Create Room</Link>
          <div className="join-group">
            <input type="number" name="code" min={0} max={9999} value={this.state.code} onChange={this.handleCodeChange} />
            <Link className="button" to={`/room/${this.state.code}`}>Join</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;