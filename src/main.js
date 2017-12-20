import environment from './environment';
import { ToolFactory } from 'services/tool-factory';
import { Tool } from './views/tool/tool';

export function configure(aurelia) {

  const toolFactory = aurelia.container.get(ToolFactory);
  const registerTool = (config) => config && config.register(toolFactory);

  aurelia.use
    .standardConfiguration()
    .globalResources('components/icon/icon')
    .feature('tools/gen-mapper', registerTool)

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
