import voltranConfig from '../../../voltran.config';

function generateInitialState(initialState, componentName) {
  const prefix = voltranConfig.prefix.toUpperCase();
  const include = `window.${prefix}.${componentName.toUpperCase().replace(/['"]+/g, '')}`;

  return `
  window.${prefix} = window.${prefix} || {};

  ${include} = Object.assign(${include} || {}, {
    '${initialState.id}': {
      'STATE': ${JSON.stringify(initialState).replace(new RegExp('</script>', 'g'), '<\\/script>')}
    }
  })`;
}

function cr(condition, ok, cancel) {
  return condition ? ok : cancel || '';
}

function componentClassName(componentName, context) {
  return context.query && context.query.id ? `${componentName}_${context.query.id}` : componentName;
}

function Html({
  componentName,
  bodyHtml,
  styleTags,
  initialState,
  fullWidth,
  isMobileFragment,
  context
}) {
  return `
    <div>
      ${styleTags}
      <script type='text/javascript'>${generateInitialState(initialState, componentName)}</script>
      <div
        id='${componentName.replace(/['"']+/g, '')}_${initialState.id}'
        style="pointer-events: none;"
        class="${voltranConfig.prefix}-voltran-body voltran-body ${
    isMobileFragment ? 'mobile' : ''
  }${fullWidth ? 'full' : ''} ${componentClassName(componentName, context)}">
        ${bodyHtml}
      </div>
      <div>REPLACE_WITH_LINKS</div>
      <div>REPLACE_WITH_SCRIPTS</div>

      ${cr(
        process.env.NODE_ENV !== 'production',
        `<meta httpEquiv="X-UA-Compatible" content="IE=edge" />`
      )}
      ${cr(
        process.env.NODE_ENV !== 'production',
        `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />`
      )}
    </div>`;
}

export default Html;
