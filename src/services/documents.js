import { inject } from 'aurelia-framework';
import { Ls } from 'services/ls';
import { tools } from 'services/tools';
import { Auth } from 'services/auth';
import { DocumentsApi } from './api/documents';

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

@inject(Auth, DocumentsApi)
export class Documents {
  docs = [];
  _current = {};
  current = new WatchedDoc();
  tool = null;

  subcriptions = [];

  constructor(auth, documentsApi) {
    this.auth = auth;
    this.documentsApi = documentsApi;
  }

  serialize() {
    if (!this.auth.isAuth) {
      Ls.set(`documents__${this.tool.docFormat}`, JSON.stringify(this.docs));
    }
  }

  deserialize() {
    if (this.auth.isAuth) {
      return this.documentsApi.getAll('/documents').then(docs => {
        this.docs = docs.filter(doc => doc.format === this.tool.template.format);
        console.log(this.docs);
        return this.docs;
      })
    } else {
      this.docs = JSON.parse(Ls.get(`documents__${this.tool.docFormat}`)) || [];
      return Promise.resolve(this.docs);
    }
  }

  get empty() {
    return !this.docs.length;
  }

  getDocuments() {
    return this.deserialize();
  }

  setTool(id) {
    this.tool = tools[id];
    this.deserialize().then(()=> {
      this.changeCurrent(this.docs[0]);
    });
  }

  delete(doc) {
    if (this.auth.isAuth && doc.id) {
      return this.documentsApi.delete(doc.id);
    } else {
      this.docs.splice(this.docs.indexOf(doc), 1);
      this.serialize();
      if (doc === this._current) this.changeCurrent(this.docs[0]);
      return Promise.resolve();
    }
  }

  create(overrides = {}) {
    const newDoc = Object.assign({}, {
      format: this.tool.template.format,
      title: this.tool.template.title + ' ' + this.docs.length,
      content: this.tool.template.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }, overrides);

    if (this.auth.isAuth) {
      this.documentsApi.create(newDoc)
        .then((req) => this.getDocuments())
        .then(() => this.changeCurrent(this.docs[0]));
    } else {
      newDoc.id = this.uniqueId();
      this.docs.unshift(newDoc);
      this.changeCurrent(this.docs[0]);
      this.serialize();
    }
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

    if (this.auth.isAuth) {
      this.documentsApi.update(this._current.id, this.current).then((updated) => {
        // console.log({updated})
      })
    } else {
      this.serialize();
    }
  }

  changeCurrent(doc) {
    if (doc) {
      this._current = doc;
      this.current.assign(doc);
      this._callSubscribers(doc);
    } else {
      this.current.title = '';
      this.current.content = '';
      this._current.title = '';
      this._current.content = '';
    }
  }

  subscribe(fn) {
    const dispose = () => {
      const index = this.subcriptions.indexOf(fn);
      if (index > -1) {
        this.subcriptions.splice(index, 1);
      }
    };
    this.subcriptions.push(fn);
    return { dispose }
  }

  _callSubscribers(arg) {
    this.subcriptions.forEach(s => s(arg))
  }
}
