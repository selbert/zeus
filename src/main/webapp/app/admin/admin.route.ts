import { Routes } from '@angular/router';
import {
    auditsRoute,
    configurationRoute,
    docsRoute,
    healthRoute,
    lightningRoute,
    logsRoute,
    metricsRoute,
    userMgmtRoute,
    invoiceRoute,
    homeRoute
} from './';
import { UserRouteAccessService } from 'app/core';
import { errorRoute, navbarRoute } from 'app/layouts';

const ADMIN_ROUTES = [
    auditsRoute,
    configurationRoute,
    docsRoute,
    healthRoute,
    logsRoute,
    lightningRoute,
    ...userMgmtRoute,
    metricsRoute,
    ...invoiceRoute,
    lightningRoute
];

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

export const adminState: Routes = [
    {
        path: '',
        redirectTo: '/admin/home',
        pathMatch: 'full'
    },
    homeRoute,
    ...LAYOUT_ROUTES,
    {
        path: 'admin',
        children: [
            {
                path: '',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                canActivate: [UserRouteAccessService],
                children: ADMIN_ROUTES
            }
        ]
    }
];
