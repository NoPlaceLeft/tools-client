
import { Ls } from 'services/ls';
import { tools } from 'services/tools';
let lastId = 1;

class WatchedDoc {
  _title;
  _content;
  title;
  content;

  get dirty() {
    return (this._title !== this.title || this._content !== this.content);
  }

  assign({ title, content }) {
    this._title = title;
    this.title = title;
    this._content = content;
    this.content = content;
  }
}

export class Documents {
  docs = [];
  _current = {};
  current = new WatchedDoc();
  tool = null;

  serialize() {
    Ls.set(`documents__${this.tool.docFormat}`, JSON.stringify(this.docs));
  }

  deserialize() {
    this.docs = JSON.parse(Ls.get(`documents__${this.tool.docFormat}`)) || [];
  }

  get empty() {
    return !this.docs.length;
  }

  setTool(id) {
    this.tool = tools[id];
    this.deserialize();
    this.changeCurrent(this.docs[0]);
  }

  delete(doc, $event) {
    $event.stopPropagation();

    this.docs.splice(this.docs.indexOf(doc), 1);
    this.serialize();

    if (doc === this._current) this.changeCurrent(this.docs[0]);
  }

  create(overrides = {}) {
    this.docs.unshift(Object.assign({}, {
      format: this.tool.template.format,
      title: this.tool.template.title,
      content: this.tool.template.content,
      id: this.uniqueId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, overrides));

    this.changeCurrent(this.docs[0]);
    this.serialize();
  }

  uniqueId() {
    const newId = lastId++;
    return this.docs.filter(d => d.id === newId).length ? this.uniqueId() : newId;
  }

  saveCurrent() {
    this._current.title = this.current.title;
    this._current.content = this.current.content;
    this._current.updatedAt = new Date();
    this.current.assign(this._current);

    this.serialize();
  }

  changeCurrent(document) {
    if (document) {
      this._current = document;
      this.current.assign(document);
    }
  }
}
