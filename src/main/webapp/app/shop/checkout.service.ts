import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { Invoice } from 'app/shared/model/invoice.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, Subscription } from 'rxjs/index';
import { WindowRef } from 'app/core/tracker/window.service';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
    stompClient = null;
    subscriber = null;
    connection: Promise<any>;
    connectedPromise: any;
    listener: Observable<any>;
    listenerObserver: Observer<any>;

    private subscription: Subscription;
    private availabilityUrl = SERVER_API_URL + 'api/shop/available';
    private invoiceUrl = SERVER_API_URL + 'api/invoice/new';

    constructor(private http: HttpClient, private $window: WindowRef) {
        this.connection = this.createConnection();
        this.listener = this.createListener();
    }

    getAvailability() {
        return this.http.get(this.availabilityUrl);
    }

    createInvoice(order) {
        return this.http.post<Invoice>(this.invoiceUrl, order);
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

    private createListener(): Observable<any> {
        return new Observable(observer => {
            this.listenerObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => (this.connectedPromise = resolve));
    }
}
