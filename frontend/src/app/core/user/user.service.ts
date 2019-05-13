import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getServerUrl } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private resourceUrl = getServerUrl() + 'api/users';

    constructor(private http: HttpClient) {}

    changePassword(passwords: any): Observable<HttpResponse<void>> {
        return this.http.post<void>(`${this.resourceUrl}/password`, passwords, { observe: 'response' });
    }

    find(login: string): Observable<HttpResponse<IUser>> {
        return this.http.get<IUser>(`${this.resourceUrl}/${login}`, { observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<IUser[]>> {
        const options = createRequestOption(req);
        return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    authorities(): Observable<string[]> {
        return this.http.get<string[]>(getServerUrl() + 'api/users/authorities');
    }
}
