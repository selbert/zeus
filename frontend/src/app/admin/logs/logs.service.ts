import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getServerUrl } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class LogsService {
    constructor(private http: HttpClient) {}

    changeLevel(name: string, configuredLevel: string): Observable<HttpResponse<any>> {
        return this.http.post(getServerUrl() + 'management/loggers/' + name, { configuredLevel }, { observe: 'response' });
    }

    findAll(): Observable<HttpResponse<any>> {
        return this.http.get<any>(getServerUrl() + 'management/loggers', { observe: 'response' });
    }
}
