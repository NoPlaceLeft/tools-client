
import { GenMapper } from './gen-mapper';

export function configure(frameworkConfirguration, config) {
  const configuration = {
    register(tools) {
      tools.register('gen-mapper', GenMapper)
    }
  }

  return config && config(configuration);
}
