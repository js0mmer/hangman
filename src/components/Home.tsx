import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Home extends React.Component {
  render() {
    return(
      <div className="title-screen">
        <div className="wrapper">
          <h1>Hangman</h1>
          <Link className="button" to="/room">Create Room</Link>
          <div className="join-group">
            <input type="text" name="code" />
            <a className="button" href="#">Join</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;