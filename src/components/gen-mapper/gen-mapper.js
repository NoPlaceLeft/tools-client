import { inject } from 'aurelia-framework';
import { GenMapperGraph } from './gen-mapper-graph';
import { Templates } from 'services/templates';
import { Documents } from 'services/documents';

@inject(Templates, Documents)
export class GenMapper {
  constructor(templates, documents) {
    this.templates = templates;
    this.documents = documents;
  }

  attached() {
    if (this.documents.tool && this.documents.tool.template) {
      this.templates.selectFormat(this.documents.tool.template.format);
    }

    this.genMapperGraph = new GenMapperGraph(this.documents.current, this.templates.current);
  }
}
