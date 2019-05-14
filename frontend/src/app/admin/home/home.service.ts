import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { getServerUrl } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private http: HttpClient) {}

    public getConfiguration(key): Observable<any> {
        return this.http.get(getServerUrl() + 'api/admin/config/' + key);
    }

    public setConfiguration(key, value): Observable<any> {
        return this.http.post(getServerUrl() + 'api/admin/config/' + key, { key, value });
    }

    public restart(): Observable<any> {
        return this.http.post(getServerUrl() + 'api/admin/shop/restart', {});
    }
}
