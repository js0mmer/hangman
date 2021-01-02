import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Room from './components/Room';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/room/:id" component={Room} />
        <Route path="/room" component={Room} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
