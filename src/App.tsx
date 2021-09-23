import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from './store/context'
import './App.css';

import Layout from './pages/Layout'

const App: React.FC<any> = () => {
  return (
    <Provider>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" component={Layout} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
