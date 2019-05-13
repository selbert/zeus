import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getServerUrl } from 'app/app.constants';
import { Log } from './log.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
    constructor(private http: HttpClient) {}

    changeLevel(log: Log): Observable<HttpResponse<any>> {
        return this.http.put(getServerUrl() + 'management/logs', log, { observe: 'response' });
    }

    findAll(): Observable<HttpResponse<Log[]>> {
        return this.http.get<Log[]>(getServerUrl() + 'management/logs', { observe: 'response' });
    }
}
