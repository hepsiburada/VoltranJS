import ServerApiManagerCache from '../core/api/ServerApiManagerCache';
import { isPreview, renderComponent, renderLinksAndScripts } from '../service/RenderService';

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
      this.servicesMap = this.getServicesMap();
      this.winnerMap = {};
    }
  }

  setInitialState(prepareInitialStateArgs) {
    this.initialState = {
      data: this.component.object.prepareInitialState(...prepareInitialStateArgs)
    };
  }

  isPredefinedInitialStateSupported() {
    return this.component.object.getServicesMap && this.component.object.prepareInitialState;
  }

  getServicesMap() {
    const services = this.component.object.services.map(
      serviceName => ServerApiManagerCache[serviceName]
    );

    const params = [...services, this.context];
    return this.component.object.getServicesMap(...params);
  }

  render() {
    return new Promise(resolve => {
      renderComponent(this.component, this.context, this.initialState).then(response => {
        const { output, links, scripts, activeComponent, seoState, fullHtml } = response;
        const html = renderLinksAndScripts(output, '', '');

        resolve({
          key: this.component.name,
          value: {
            html,
            scripts,
            style: links,
            activeComponent,
            seoState,
            ...(isPreview(this.context?.query) && { fullHtml })
          },
          id: this.component.id
        });
      });
    });
  }
}
