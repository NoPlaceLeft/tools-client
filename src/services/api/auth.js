import { inject } from 'aurelia-framework';
import { Api } from 'services/api/index';

@inject(Api)
export class AuthApi {
  constructor(api) {
    this.api = api;
  }

  login(form) {
    return this.api.post('/auth', form);
  }

  signup(form) {
    return this.api.post('/users', form);
  }
}
