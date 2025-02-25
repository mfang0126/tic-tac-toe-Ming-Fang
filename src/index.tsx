import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './Game';
import Room from './Room';
import * as serviceWorker from './serviceWorker';

const AppContainer = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Game} />
        <Route exact path='/room' component={Room} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<AppContainer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
