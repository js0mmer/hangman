import React from 'react';

interface IProps {
  onUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  submitUsername: (event: React.MouseEvent<HTMLSpanElement>) => void,
  username: string
}

class Username extends React.Component<IProps> {
  render() {
    return(
    <div className="create-room container">
        <div className="rounded-card">
        <h3 className="heading">Enter a username</h3>
        <div>
            <div className="word-input">
            <input type="text" placeholder="Type here..." maxLength={16} size={16} value={this.props.username} onChange={this.props.onUsernameChange} />
            <span className="underline"></span>
            </div>
            <span className={'button button-small' + (this.props.username === '' ? ' disabled' : '')} style={{ display: 'inline' }} onClick={this.props.submitUsername}>Submit</span>
        </div>
        </div>
    </div>
    );
  }
}

export default Username;