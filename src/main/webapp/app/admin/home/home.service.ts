import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private http: HttpClient) {}

    public getConfiguration(key): Observable<any> {
        return this.http.get(SERVER_API_URL + 'api/admin/config/' + key);
    }

    public setConfiguration(key, value): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/admin/config/' + key, { key, value });
    }

    public restart(): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/admin/shop/restart', {});
    }
}
