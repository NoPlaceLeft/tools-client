
export class Ls {
  static get(key) {
    return window.localStorage.getItem(key);
  }

  static set(key, value) {
    window.localStorage.setItem(key, value);
  }
}
