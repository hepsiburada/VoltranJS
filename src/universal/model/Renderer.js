import omit from 'lodash/omit';
import { isPreview, renderComponent, renderLinksAndScripts } from '../service/RenderService';
import { BLACKLIST_OUTPUT } from '../utils/constants';

export default class Renderer {
  constructor(component, context) {
    this.component = component;
    this.context = context;
    this.servicesMap = null;
    this.initialState = null;
    this.winnerMap = null;

    if (
      this.isPredefinedInitialStateSupported() &&
      (process.env.BROWSER || (!process.env.BROWSER && !this.context.isWithoutState))
    ) {
      this.servicesMap = this.getServicesWithMultiple();
      this.winnerMap = {};
    }
  }

  setInitialState(prepareInitialStateArgs) {
    this.initialState = {
      data: this.component.object.getInitialStateWithMultiple(...prepareInitialStateArgs)
    };
  }

  isPredefinedInitialStateSupported() {
    return (
      this.component.object.getServicesWithMultiple &&
      this.component.object.getInitialStateWithMultiple
    );
  }

  getServicesWithMultiple() {
    return this.component.object.getServicesWithMultiple(this.context);
  }

  render() {
    return new Promise(resolve => {
      renderComponent(this.component, this.context, this.initialState).then(response => {
        const { output, links, fullHtml, ...rest } = response;
        const otherParams = omit(rest, BLACKLIST_OUTPUT);
        const html = renderLinksAndScripts(output, '', '');

        resolve({
          key: this.component.name,
          value: {
            html,
            style: links,
            ...otherParams,
            ...(isPreview(this.context?.query) && { fullHtml })
          },
          id: this.component.id
        });
      });
    });
  }
}
