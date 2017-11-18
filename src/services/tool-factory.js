import { Container, Factory, inject } from 'aurelia-framework';
import { GenMapper } from "../components/gen-mapper/gen-mapper";
import { relativeTimeRounding } from "../../node_modules/moment/moment";

@inject(Container)
export class ToolFactory {
  components = {};

  constructor(container) {
    this.container = container;
  }

  register(key, component) {
    this.components[key] = component;
  }

  getComponent(key) {
    if (this.components[key]) {
      return this.container.get(Factory.of(this.components[key]));
    }
    console.warn('Requested for unfound component ' + key);
    return null;
  }
}
