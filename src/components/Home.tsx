import React from 'react';
import { Link } from "react-router-dom";


interface IState {
  code: number
}

class Home extends React.Component<{}, IState> {
  readonly state: IState = { code: NaN };

  handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 6) {
      this.setState({ code: Number.parseInt(e.target.value) });
    }
  }

  render() {
    return(
      <div className="title-screen">
        <div className="wrapper">
          <h1>Hangman</h1>
          <Link className="button" to="/create-room">Create Room</Link>
          <div className="join-group">
            <input type="number" name="code" min={0} max={999999} value={this.state.code} onChange={this.handleCodeChange} />
            <Link className={'button' + (isNaN(this.state.code) || String(this.state.code).length < 6 ? ' disabled' : '')} to={`/room/${this.state.code}`}>Join</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;