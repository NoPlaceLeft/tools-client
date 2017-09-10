
import { Ls } from 'services/ls';
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

  serialize() {
    Ls.set('documents', JSON.stringify(this.docs));
  }

  deserialize() {
    this.docs = JSON.parse(Ls.get('documents')) || [];
  }

  get empty() {
    return !this.docs.length;
  }

  constructor() {
    this.deserialize();
    this.changeCurrent(this.docs[0]);
  }

  delete(doc, $event) {
    $event.stopPropagation();
    if (doc === this._current) this.changeCurrent(this.docs[0]);

    this.docs.splice(this.docs.indexOf(doc), 1);
    this.serialize();
  }

  create() {
    this.docs.unshift({
      format: 'churchCircles',
      title: 'New Document',
      content: 'Dummy Content',
      id: this.uniqueId()
    });

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
