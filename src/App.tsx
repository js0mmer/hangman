import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Room from './components/Room';
import CreateRoom from './components/CreateRoom';

function App() {
  return (
    <Router basename="/">
      <Switch>
        <Route path="/room/:id" component={Room} />
        <Route path="/create-room" component={CreateRoom} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
