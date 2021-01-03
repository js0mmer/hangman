import React from 'react';

interface IState {
  word: string
}

class CreateRoom extends React.Component<{}, IState> {
  readonly state: IState = { word: '' }

  onWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-zA-Z]+$/) || e.target.value === '') {
      this.setState({ word: e.target.value });
    }
  }

  render() {
    return(
      <div className="create-room container">
        <div className="rounded-card">
          <h3 className="heading">Enter a word</h3>
          <div>
            <div className="word-input">
              <input type="text" placeholder="Type here..." maxLength={16} size={16} value={this.state.word} onChange={this.onWordChange} />
              <span className="underline"></span>
            </div>
            <span className={'button button-small' + (this.state.word === '' ? ' disabled' : '')} style={{ display: 'inline' }}>Submit</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateRoom;