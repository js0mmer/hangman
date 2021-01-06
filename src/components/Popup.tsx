import React from 'react';

export enum GameResult {
    WIN = 'You Won!',
    LOSE = 'Game over'
}

class Popup extends React.Component<{ result: GameResult }> {
    render() {
        return <div className="popup rounded-card"><h1>{this.props.result}</h1></div>;
    }
}

export default Popup;