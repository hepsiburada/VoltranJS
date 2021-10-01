import routesWithComponents from '../core/route/routesWithComponents';
// eslint-disable-next-line import/named
import { createComponentName, generateComponents } from '../utils/helper';

const componentConfig = require('__V_COMPONENTS__');

const components = generateComponents(componentConfig.default);

export default class Component {
  static getComponentName = path => {
    return createComponentName(path);
  };

  static getComponentPath = name => `/${name}`;

  static getComponentIsMobileFragment = path => {
    return components[path].isMobileFragment ? components[path].isMobileFragment : false;
  };

  static getComponentIsFullWidth = path => {
    return components[path].fullWidth ? components[path].fullWidth : false;
  };

  static getComponentIsPreviewQuery = path => {
    return components[path].isPreviewQuery || true;
  };

  static getComponentObjectWithPath = path => routesWithComponents[path];

  static getComponentWithName = name => new Component(Component.getComponentPath(name));

  static getComponentWithPath = path => new Component(path);

  static isExist = path => Object.prototype.hasOwnProperty.call(routesWithComponents, path);

  constructor(path) {
    this.name = Component.getComponentName(path);
    this.path = path;
    this.isMobileFragment = Component.getComponentIsMobileFragment(path);
    this.fullWidth = Component.getComponentIsFullWidth(path);
    this.object = Component.getComponentObjectWithPath(path);
    this.isPreviewQuery = Component.getComponentIsPreviewQuery(path);
  }
}
