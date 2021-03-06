import { inject } from 'aurelia-framework';
import { AuthApi } from 'services/api/auth';
import { Router } from 'aurelia-router';

@inject(AuthApi, Router)
export class Auth {
  constructor(authApi, router) {
    this.api = authApi;
    this.router = router;
  }

  get isAuth() {
    return !!sessionStorage.getItem('auth_token');
  }

  user() {
    return this.api.user().then(user => {
      user.userName = user.email.replace(/\@.+/gi, '');
      return user;
    });
  }

  login(form) {
    return this.api.login(form)
      .then(token => {
        sessionStorage.setItem('auth_token', token);
        this.api.api.configure();
        this.router.navigate('');
      });
  }

  signup(form) {
    return this.api.signup(form)
      .then(() => this.login(form));
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    this.router.navigate('');
  }
}
