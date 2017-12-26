import { inject, useView } from 'aurelia-framework';
import { GenMapperGraph } from './gen-mapper-graph';
import { Templates } from 'services/templates';
import { Documents } from 'services/documents';


@useView('tools/gen-mapper/gen-mapper.html')
@inject(Templates, Documents)
export class GenMapper {

  subscription;

  constructor(templates, documents, options = {}) {
    this.templates = templates;
    this.documents = documents;

    this.options = {
      onChange: options.onChange || function() {},
    };
  }

  changeContent(doc) {
    this.currentDoc = doc;
    
    if (!this.currentDoc) {
      this.currentDoc = {title : '', content: this.genMapperGraph.initialCsv}
    }

    if (!this.genMapperGraph) {
      this.genMapperGraph = new GenMapperGraph(doc, this.templates.current);
    } else {
      this.genMapperGraph.changeProject(doc, this.templates.current);
    }
    
    this.genMapperGraph.onChange((content) => {
      this.currentDoc.content = content;
      this.options.onChange(this.currentDoc);
    });
  }

  detached() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }

  updateComponentPosition() {
    this.genMapperGraph.origPosition();  
  }
}