/* eslint-disable no-console */
const application = 'voltran';
const currentThread = 'event-loop';
const sourceContext = 'app';
const colors = require('colors');

const logger = {
  formatter(level, message) {
    return `{"SourceContext":"${sourceContext}","@i":"${currentThread}","Application":"${application}","@l":"${level}", "@m":"${message}","@t":"${new Date().getTime()}"}`;
  },

  info(message) {
    if (process.env.BROWSER && process.env.VOLTRAN_ENV === 'prod') {
      return;
    }

    console.log(colors.blue(this.formatter('INFO', message)));
  },

  error(message) {
    if (process.env.BROWSER && process.env.VOLTRAN_ENV === 'prod') {
      return;
    }

    console.error(this.formatter('ERROR', message));
  },

  warning(message) {
    console.warn(colors.yellow(message));
  },

  exception(exception, stack = true, requestPath = null) {
    if (process.env.BROWSER && process.env.VOLTRAN_ENV === 'prod') {
      return;
    }

    let message = '';
    message += `Message: ${exception.message}`;
    if (stack) {
      message += `\\n Stack: ${exception.stack.replace(/\n/g, '\\n')}`;
    }

    console.error(this.formatter('ERROR', message, requestPath));
  }
};

export default logger;
