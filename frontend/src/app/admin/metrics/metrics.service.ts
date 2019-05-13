import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getServerUrl } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class JhiMetricsService {
    constructor(private http: HttpClient) {}

    getMetrics(): Observable<any> {
        return this.http.get(getServerUrl() + 'management/metrics');
    }

    threadDump(): Observable<any> {
        return this.http.get(getServerUrl() + 'management/threaddump');
    }
}
