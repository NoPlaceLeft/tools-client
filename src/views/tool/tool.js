import { inject, bindable, Factory } from 'aurelia-framework';
import { Documents } from 'services/documents';
import { tools } from 'services/tools';
import { ToolFactory } from 'services/tool-factory';
import { activationStrategy } from 'aurelia-router';
import { timeout } from 'services/utils';
import { DocumentsApi } from 'services/api/documents';
import { GenMapper } from 'tools/gen-mapper/gen-mapper';

@inject(Documents, DocumentsApi, Factory.of(GenMapper))
export class Tool {
  sidebarCollapsed = false;
  component = null;
  canPersist = true;
  
  editModeDoc = null;
  editModeDocInput = null;

  docSubscription = null;

  @bindable importFile;

  constructor(documents, documentsApi, GenMapper) {
    this.documents = documents;
    this.documentsApi = documentsApi;
    
    this.component = GenMapper({
      onChange: (doc)=> {
        this.documents.updateDocument(doc);
      }
    });

    this.docSubscription = this.documents.subscribe((doc) => {
      this.component.changeContent(doc);
    });
  }

  activate({ id }) {
    this.canPersist = tools[id].canPersist;
    this.documents.setTool(id);
    this.documents.getDocuments();
  }

  deactivate() {
    if (this.docSubscription) {
      this.docSubscription.dispose();
    }
  }

  selectDocument(doc) {
    this.documents.selectDocument(doc);
  }

  onDocumentTitleChange(doc) {
    this.documents.updateDocument(doc);
  }

  importFileChanged(files) {
    let name = files[0].name.split('.');
    name.pop();
    name = name.join('.');

    const reader = new FileReader();
    
    reader.onload = (d) => {
      const content = d.target.result;
      this.documents.create({
        content: content,
        title: name
      });
    };
    
    reader.readAsText(files[0]);
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

  deleteDocument($event, doc) {
    const checkPrompt = window.prompt('Please type the name of the document you would like to DELETE!');
    if (checkPrompt === doc.title) {
      this.documents.delete(doc).then(() => {
        this.selectDocument(this.documents.docs[0]);
      });
    }
  }

  onToggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    timeout(() => {
      this.component.updateComponentPosition();
    });
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
