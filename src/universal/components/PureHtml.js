import voltranConfig from '../../../voltran.config';

function generateInitialState(initialState, componentName) {
  const prefix = voltranConfig.prefix.toUpperCase();
  const include = `window.${prefix}.${componentName.toUpperCase().replace(/['"]+/g, '')}`;

  return `
    window.${prefix} = window.${prefix} || {};
    ${include} = {
      ...(${include} || {}),
      '${initialState.id}': {
        'STATE': ${JSON.stringify(initialState).replace(
          new RegExp('</script>', 'g'),
          '<\\/script>'
        )}
      }
    }`;
}

const generateScripts = scripts => {
  return scripts
    .map(script => {
      return `<script src="${script.src}" ${script.isAsync ? 'async' : ''}></script>`;
    })
    .join('');
};

const generateLinks = links => {
  return links.map(link => `<link rel="${link.rel}" href="${link.href}" />`).join('');
};

export { generateScripts, generateLinks };

export default (resultPath, componentName, initialState) => {
  return `
    <div>
      <script type="text/javascript">${generateInitialState(initialState, componentName)}</script>
      <div id='${componentName.replace(/['"']+/g, '')}_${
    initialState.id
  }' style="pointer-events: none;"></div>
      <div>REPLACE_WITH_LINKS</div>
      <div>REPLACE_WITH_SCRIPTS</div>
    </div>
`;
};
