import { inject, bindable } from 'aurelia-framework';
import { Documents } from 'services/documents';
import { tools } from 'services/tools';

@inject(Documents)
export class Tool {
  canPersist = true;
  @bindable importFile;

  constructor(documents, ) {
    this.documents = documents;
  }

  activate({ id }) {
    this.canPersist = tools[id].canPersist;
    this.documents.setTool(id);
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
}

export class DateFormatValueConverter {
  toView(value) {
    return moment(value).calendar();
  }
}
