import { Route } from '@angular/router';

import { JhiHomeComponent } from './home.component';

export const homeRoute: Route = {
    path: 'home',
    component: JhiHomeComponent,
    data: {
        authorities: [],
        pageTitle: 'Welcome, Java Hipster!'
    }
};
