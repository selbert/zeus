import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { Invoice } from 'app/shared/model/invoice.model';

type EntityResponseType = HttpResponse<Invoice>;
type EntityArrayResponseType = HttpResponse<Invoice[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    private resourceUrl = SERVER_API_URL + 'api/invoices';

    constructor(private http: HttpClient) {}

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Invoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<Invoice[]>(this.resourceUrl, {
                params: options,
                observe: 'response'
            })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(invoice: Invoice): Invoice {
        const copy: Invoice = Object.assign({}, invoice, {
            creationDate: invoice.creationDate != null && invoice.creationDate.isValid() ? invoice.creationDate.toJSON() : null,
            settleDate: invoice.settleDate != null && invoice.settleDate.isValid() ? invoice.settleDate.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.creationDate = res.body.creationDate != null ? moment(res.body.creationDate) : null;
        res.body.settleDate = res.body.settleDate != null ? moment(res.body.settleDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((invoice: Invoice) => {
            invoice.creationDate = invoice.creationDate != null ? moment(invoice.creationDate) : null;
            invoice.settleDate = invoice.settleDate != null ? moment(invoice.settleDate) : null;
        });
        return res;
    }
}
