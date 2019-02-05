import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice } from 'app/shared/model/invoice.model';
import { JhiInvoiceComponent } from './invoice.component';
import { JhiInvoiceDetailComponent } from './invoice-detail.component';
import { InvoiceService } from 'app/shared/service/invoice.service';

@Injectable({ providedIn: 'root' })
export class InvoiceResolve implements Resolve<Invoice> {
    constructor(private service: InvoiceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((invoice: HttpResponse<Invoice>) => invoice.body));
        }
        return of({});
    }
}

export const invoiceRoute: Routes = [
    {
        path: 'invoice',
        component: JhiInvoiceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Invoices'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'invoice/:id/view',
        component: JhiInvoiceDetailComponent,
        resolve: {
            invoice: InvoiceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Invoices'
        },
        canActivate: [UserRouteAccessService]
    }
];
