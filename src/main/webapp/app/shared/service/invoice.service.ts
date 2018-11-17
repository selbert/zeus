import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { Invoice } from 'app/shared/model/invoice.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Observer, Subscription } from 'rxjs/index';
import { WindowRef } from 'app/core/tracker/window.service';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';
import { createRequestOption } from 'app/shared';
import { map } from 'rxjs/operators';
import moment = require('moment');

type EntityResponseType = HttpResponse<Invoice>;
type EntityArrayResponseType = HttpResponse<Invoice[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    stompClient = null;
    subscriber = null;
    connection: Promise<any>;
    connectedPromise: any;
    listener: Observable<any>;
    listenerObserver: Observer<any>;

    private subscription: Subscription;
    private invoicesUrl = SERVER_API_URL + 'api/invoices';
    private invoiceUrl = SERVER_API_URL + 'api/invoice';

    constructor(private http: HttpClient, private $window: WindowRef) {
        this.connection = this.createConnection();
        this.listener = this.createListener();
    }

    createInvoice(order) {
        return this.http.post<Invoice>(`${this.invoiceUrl}/new`, order);
    }

    createDonation(donation) {
        return this.http.post<Invoice>(`${this.invoiceUrl}/donation`, donation);
    }

    connect(errCb) {
        if (this.connectedPromise === null) {
            this.connection = this.createConnection();
        }
        // building absolute path so that websocket doesn't fail when deploying with a context path
        const loc = this.$window.nativeWindow.location;
        let url;
        url = '//' + loc.host + loc.pathname + 'websocket/invoice?access_token=';
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        const headers = {};
        this.stompClient.connect(
            headers,
            () => {
                this.connectedPromise('success');
                this.connectedPromise = null;
            },
            errCb
        );
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    receive() {
        return this.listener;
    }

    subscribe() {
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe('/topic/invoice', data => {
                this.listenerObserver.next(JSON.parse(data.body));
            });
            this.stompClient.subscribe('/topic/shop/restart', () => {
                this.$window.nativeWindow.location.reload(true);
            });
        });
    }

    unsubscribe() {
        if (this.subscriber !== null) {
            this.subscriber.unsubscribe();
        }
        this.listener = this.createListener();
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<Invoice>(`${this.invoicesUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<Invoice[]>(this.invoicesUrl, {
                params: options,
                observe: 'response'
            })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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

    private createListener(): Observable<any> {
        return new Observable(observer => {
            this.listenerObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => (this.connectedPromise = resolve));
    }
}
