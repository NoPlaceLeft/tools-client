import { inject, bindable } from 'aurelia-framework';
import { Documents } from 'services/documents';
import { tools } from 'services/tools';
import { ToolFactory } from 'services/tool-factory';
import { activationStrategy } from 'aurelia-router';
import { timeout } from 'services/utils';
import { DocumentsApi } from 'services/api/documents';

@inject(Documents, ToolFactory, DocumentsApi)
export class Tool {
  sidebarCollapsed = false;
  component = null;
  canPersist = true;
  editModeDoc = null;
  editModeDocInput = null;

  @bindable importFile;

  constructor(documents, toolFactory, documentsApi) {
    this.documents = documents;
    this.toolFactory = toolFactory;
    this.documentsApi = documentsApi;
  }

  configureRouter(config, router) {
    config.map([
      {
        route: [''],
        moduleId: 'tools/gen-mapper/tool',
        name: 'gen-mapper'
      },
      {
        route: [':documentId'],
        moduleId: 'tools/gen-mapper/tool',
        name: 'gen-mapper-child'
      }
    ]);
    this.router = router;
  }

  activate({ id }) {
    this.canPersist = tools[id].canPersist;
    this.documents.setTool(id);
    this.documents.getDocuments().then(docs => {
      this.docs = docs;
    });
    
    // const componentFactory = this.toolFactory.getComponent(this.documents.tool.component);

    // if (componentFactory) {
    //   this.component = componentFactory();
    // }
  }

  importFileChanged(files) {
    let name = files[0].name.split('.');
    name.pop();
    name = name.join('.');

    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (d) => {
        resolve(d.target.result);
      };
      reader.readAsText(files[0]);
    })
      .then(d => {
        this.documents.create({
          content: d,
          title: name
        });
      });
  }

  enableEditMode(doc) {
    this.editModeDoc = doc;
    timeout(() => {
      if (this.editModeDocInput) {
        this.editModeDocInput.focus();
      }
    });
  }

  disableEditMode(doc) {
    this.editModeDoc = null;
    this.editModeDocInput = null;
  }

  onTitleChange(doc) {
    if (this.documents.current === doc) {
      this.documents.saveCurrent();
    }
    this.documents.serialize();
    this.documents.deserialize();
  }

  deleteDocument($event, doc) {
    const checkPrompt = window.prompt('Please type the name of the document you would like to DELETE!');
    if (checkPrompt === doc.title) {
      this.documents.delete(doc, $event);
    }
  }

  onToggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    timeout(() => {
      this.component.updateComponentPosition();
    });
  }

  selectDocument(doc) {
    this.router.navigate(doc.id);
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }
}

export class DateFormatValueConverter {
  toView(value) {
    return moment(value).calendar();
  }
}
