import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { Auth } from '../../services/auth';
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(Auth, Router, EventAggregator, Element)
export class AuthHeader {
    user = null;
    showLoginMenu = false;
    documentClickListener = null;
    
    constructor(auth, router, eventAggregator, element) {
        this.auth = auth;
        this.router = router;
        this.eventAggregator = eventAggregator;
        this.element = element;
        this.eventAggregator.subscribe('router:navigation:complete', (e)=> {
            const route = e.instruction.config.route
            this.isLoginRoute = route === 'signup' || route === 'login';
            this.getUser();
        });
    }
    
    attached() {
        this.getUser();
    }
    
    detached() {
        this._unbindDocumentEvents();
    }

    onClick(event) {
        if (!this.auth.isAuth) {
            this.router.navigate('login');
        } else {
            this.showLoginMenu = !this.showLoginMenu;
            this._bindDocumentEvents();
        }
    }

    onLogout() {
        this.auth.logout();
        this.showLoginMenu = false;
        this._unbindDocumentEvents();
    }

    getUser() {
        if (this.auth.isAuth) {
            this.auth.user().then(user => {
                this.user = user;
            });
        }
    }

    _bindDocumentEvents() {
        this._unbindDocumentEvents();
        document.addEventListener('click', this.documentClickListener = (e)=> {
            if (!this.element.contains(e.target)) {
                this.showLoginMenu = false;
                this._unbindDocumentEvents();
            }
        }, true);
    }

    _unbindDocumentEvents() {
        document.removeEventListener('click', this.documentClickListener, true);
    }
}