import { inject } from 'aurelia-framework';
import { Auth } from 'services/auth';

@inject(Auth)
export class Signup {
  form = {};

  constructor(auth) {
    this.auth = auth;
  }
}
