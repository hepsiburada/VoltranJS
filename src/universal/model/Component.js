import routesWithComponents from '../core/route/routesWithComponents';
import { createComponentName } from '../utils/helper';

const COMPONENTS = require('__V_COMPONENTS__').default;

export default class Component {
  static getComponentName = path => {
    return createComponentName(path);
  };

  static getComponentPath = name => `/${name}`;

  static getComponentIsMobileFragment = path => {
    return COMPONENTS[path].isMobileFragment ? COMPONENTS[path].isMobileFragment : false;
  };

  static getComponentIsFullWidth = path => {
    return COMPONENTS[path].fullWidth ? COMPONENTS[path].fullWidth : false;
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
  }
}
