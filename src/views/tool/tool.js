import { inject, bindable } from 'aurelia-framework';
import { Documents } from 'services/documents';
import { tools } from 'services/tools';
import { ToolFactory } from 'services/tool-factory';
import { activationStrategy } from 'aurelia-router';

@inject(Documents, ToolFactory)
export class Tool {

  component = null;
  canPersist = true;
  editModeDoc = null;
  editModeDocInput = null;

  @bindable importFile;

  constructor(documents, toolFactory) {
    this.documents = documents;
    this.toolFactory = toolFactory;
  }

  activate({ id }) {
    this.canPersist = tools[id].canPersist;
    this.documents.setTool(id);

    const componentFactory = this.toolFactory.getComponent(this.documents.tool.component);
    if (componentFactory) {
      this.component = componentFactory();
    }
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
    const id = setTimeout(() => {
      if (this.editModeDocInput) {
        this.editModeDocInput.focus();
      }
      clearTimeout(id);
    }, 0);
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

  determineActivationStrategy() {
    return activationStrategy.replace;
  }
}

export class DateFormatValueConverter {
  toView(value) {
    return moment(value).calendar();
  }
}
