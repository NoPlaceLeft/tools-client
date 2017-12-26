export class Templates {

  _templates = window.NPL_TEMPLATES;
  current;

  get(format) {
    return this._templates.find(t => t.format === format) || null;
  }

  selectFormat(format) {
    this.current = this.get(format);
  }
}
