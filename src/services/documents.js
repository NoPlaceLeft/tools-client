import { inject, observable } from 'aurelia-framework';
import { Ls } from 'services/ls';
import { tools } from 'services/tools';
import { Auth } from 'services/auth';
import { DocumentsApi } from './api/documents';
import { Templates } from './templates';

let lastId = 1;

@inject(Auth, DocumentsApi, Templates)
export class Documents {
  
  current = null;
  docs = [];
  tool = null;

  subcriptions = [];

  constructor(auth, documentsApi, templates) {
    this.auth = auth;
    this.documentsApi = documentsApi;
    this.templates = templates;
  }

  selectDocument(doc) {
    this.current = doc;
    this._callSubscribers(doc);
  }

  updateDocument(doc) {
    if (this.auth.isAuth) {
      return this.documentsApi.update(doc.id, doc);
    } else {
      this.serialize();
      return Promise.resolve();
    }
  }

  getDocuments() {
    return this.deserialize();
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

  setTool(id) {
    this.tool = tools[id];
    if (this.tool && this.tool.template) {
      this.templates.selectFormat(this.tool.template.format);
    }
  }

  delete(doc) {
    if (this.auth.isAuth && doc.id) {
      return this.documentsApi.delete(doc.id)
        .then(() => this.getDocuments());
    } else {
      this.docs.splice(this.docs.indexOf(doc), 1);
      this.serialize();
      if (doc === this._current) this.selectDocument(this.docs[0]);
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
      return this.documentsApi.create(newDoc)
        .then((req) => this.getDocuments());
    } else {
      newDoc.id = this.uniqueId();
      this.docs.unshift(newDoc);
      this.selectDocument(this.docs[0]);
      this.serialize();
      return Promise.resolve(newDoc);
    }
  }

  uniqueId() {
    const newId = lastId++;
    return this.docs.filter(d => d.id === newId).length ? this.uniqueId() : newId;
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
