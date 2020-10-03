import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { loadGame } from './modules/game';
import store from './store'
import { connect, host } from './modules/comms';
import './i18n';
import { gameState } from './modules/game/persist';
import { PeerID } from './modules/comms/peer';
import { Session } from './storage/session';
//import * as serviceWorker from './serviceWorker';

const urlParams = new URLSearchParams(window.location.search);

// Load the game if we have it stored
const game = urlParams.get("game");
let state = gameState(game ?? "local");

// If we found saved data
if (game) {
  console.log("Found game: ", game);
  if (Session.get('was_hosting') === game) {
    console.log("REHOSTING!");
    if (state) {
      store.dispatch(loadGame(state))
    }
    Session.get('players')
    store.dispatch(host());
  } else {
    console.log("Huh")
    store.dispatch(connect(game as PeerID));
  }
} else if (state) {
      store.dispatch(loadGame(state))
}

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
