import { inject } from 'aurelia-framework';
import { DocumentsApi } from 'services/api/documents';
import { Auth } from 'services/auth';
import { ToolFactory } from '../../services/tool-factory';
import { Documents } from 'services/documents';

@inject(Documents, DocumentsApi, Auth, ToolFactory)
export class GenMapperTool {

    constructor(Documents, DocumentsApi, Auth, ToolFactory) {
        this.documents = Documents;
        this.documentsApi = DocumentsApi;
        this.auth = Auth;
        this.toolFactory = ToolFactory;
    }

    activate(params) {
        const componentFactory = this.toolFactory.getComponent(this.documents.tool.component);
        console.log(params)
        if (params.documentId && this.auth.isAuth) {
            this.documentsApi.get(params.documentId)
                .then(doc => {
                    this.doc = doc;
                    if (doc) {
                        this.component = componentFactory(this.doc, this.documents.templates.current);
                    }
                });
        }
    }
}