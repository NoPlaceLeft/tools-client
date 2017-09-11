import { inject } from 'aurelia-framework';
import { Documents } from 'services/documents';
import { tools } from 'services/tools';

@inject(Documents)
export class Tool {
  canPersist = true;

  constructor(documents, ) {
    this.documents = documents;
  }

  activate({ id }) {
    this.canPersist = tools[id].canPersist;
    this.documents.setTool(id);
  }
}

export class DateFormatValueConverter {
  toView(value) {
    return moment(value).calendar();
  }
}
