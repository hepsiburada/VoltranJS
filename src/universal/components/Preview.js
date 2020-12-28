const appConfig = require('__APP_CONFIG__');

export default (body, componentNames = [], title = null) => {
  const additionalTitle = title ? ` - ${title}` : '';

  function cr(condition, ok, cancel) {
    return condition ? ok : cancel || '';
  }

  return `
    <!doctype html>
      <head>
        <title>Preview${additionalTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>window.HBUS_LAZY = true;</script>
        <script src="${appConfig.voltranCommonUrl}"></script>
        ${cr(appConfig.showPreviewFrame,
          `<style>
            .voltran-body {
              color: #484848;
              box-sizing: border-box;
              max-width: 1264px;
              padding: 32px;
              margin: 0 auto;
              border: 1px solid #e5e5e5;
              border-radius: 6px;
              webkit-tap-highlight-color: rgba(0, 0, 0, 0);
              -webkit-tap-highlight-color: transparent;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            
            .voltran-body.full {
              width: auto;
              padding: 0;
            }

            .voltran-body.mobile {
              width: 415px;
              min-height: 827px;
              padding: 0;
              border-top: 80px solid #000;
              border-left: 20px solid #000;
              border-right: 20px solid #000;
              border-bottom: 80px solid #000;
              border-radius: 48px;
              position: relative;
            }

            .voltran-body.mobile:after {
              content: '';
              width: 48px;
              height: 48px;
              display: block;
              position: absolute;
              left: 170px;
              bottom: -62px;
              background-color: #121212;
              border-radius: 100%;
            }
          </style>`
        )}
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
};
