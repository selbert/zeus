import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from 'app/app.constants';
import { map } from 'rxjs/internal/operators';

@Injectable({ providedIn: 'root' })
export class LightningService {
    constructor(private http: HttpClient) {}

    public getInfo(): Observable<any> {
        return combineLatest(
            this.http.get(SERVER_API_URL + 'api/lnd'),
            this.http.get(SERVER_API_URL + 'api/lnd/channels'),
            this.http.get(SERVER_API_URL + 'api/bitcoin'),
            this.http.get(SERVER_API_URL + 'api/bitcoin/price/CHF')
        ).pipe(
            map((result: any[]) => ({
                lndInfo: result[0],
                lndChannels: result[1].channels,
                bitcoinInfo: result[2],
                bitcoinPrice: result[3]
            }))
        );
    }

    public getNodeInfo(nodeId): Observable<any> {
        return this.http.get(SERVER_API_URL + 'api/lnd/nodeinfo/' + nodeId);
    }
}
