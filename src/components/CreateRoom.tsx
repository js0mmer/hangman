import React from 'react';

class CreateRoom extends React.Component {
  render() {
    return(
      <div>
        <li className="enter-word">
          <h3 className="heading">Enter a word</h3>
          <div>
            <div className="word-input">
              <input placeholder="Type here..." />
              <span className="underline"></span>
            </div>
            <a className="button button-small" style={{ display: 'inline' }} href="#">Done</a>
          </div>
        </li>
      </div>
    );
  }
}

export default CreateRoom;