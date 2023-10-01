import './App.css';
import Service from './component/service';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Service} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
