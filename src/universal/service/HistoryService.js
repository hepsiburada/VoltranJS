import { createBrowserHistory } from 'history';
import { WINDOW_GLOBAL_PARAMS } from '../utils/constants';

let instance;

const setReferrer = referrer => {
  if (process.env.BROWSER) {
    window.ref = referrer;
  }
};

export default class HistoryService {
  constructor(historyKey) {
    if (instance) {
      return instance;
    }

    this.current = '';
    this.previous = '';
    this.history = null;
    this.historyKey = historyKey;
    this._listenCallback = this._listenCallback.bind(this);

    this._selectHistoryKey();

    if (process.env.BROWSER) {
      this.current = window.location.href;
      this.history = window[this.historyKey];

      if (this.historyKey === historyKey) {
        this.history.listen(this._listenCallback);
      }
    }

    instance = this;
  }

  _listenCallback(location) {
    if (!process.env.BROWSER) return;

    this.previous = this.current;
    this.current = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    setReferrer(this.previous);
  }

  _selectHistoryKey() {
    if (!process.env.BROWSER) return;

    // eslint-disable-next-line no-prototype-builtins
    if (!window.hasOwnProperty(WINDOW_GLOBAL_PARAMS.HISTORY)) {
      window[this.historyKey] = createBrowserHistory();
    } else {
      this.historyKey = WINDOW_GLOBAL_PARAMS.HISTORY;
    }
  }

  getHistory() {
    return this.history;
  }
}
