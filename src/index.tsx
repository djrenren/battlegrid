import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './store'
import { connect } from './modules/comms';
import './i18n';
//import * as serviceWorker from './serviceWorker';

const urlParams = new URLSearchParams(window.location.search);
const game = window.location.hash;
if (game) {
  store.dispatch(connect(game.substr(1)));
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
