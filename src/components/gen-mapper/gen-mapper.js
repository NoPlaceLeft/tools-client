import { inject } from 'aurelia-framework';
import { GenMapperGraph } from './gen-mapper-graph';
import { Templates } from 'services/templates';
import { Documents } from 'services/documents';

@inject(Templates, Documents)
export class GenMapper {

  subscription;

  constructor(templates, documents) {
    this.templates = templates;
    this.documents = documents;
  }

  attached() {
    this.updateTemplate();

    this.genMapperGraph = new GenMapperGraph(this.documents.current, this.templates.current);

    if (!this.documents.current.content) {
      this.documents.current.content = this.genMapperGraph.initialCsv;
    }

    this.genMapperGraph.onChange((content) => {
      this.documents.current.content = content;
    });

    this.subscription = this.documents.subscribe(() => {
      this.updateTemplate();
      this.genMapperGraph.changeProject(this.documents.current, this.templates.current);
    });
  }

  updateTemplate() {
    if (this.documents.tool && this.documents.tool.template) {
      this.templates.selectFormat(this.documents.tool.template.format);
    }
  }
}
