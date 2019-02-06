import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FRONTEND_CONTENT_URL, SERVER_API_URL } from 'app/app.constants';
import { Observable } from 'rxjs';
import { Configuration, FrontendConfiguration } from 'app/shared/model/product.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
    private availabilityUrl = SERVER_API_URL + 'api/shop/available';
    private configurationUrl = SERVER_API_URL + 'api/shop/configuration';
    private frontendConfigUrl = FRONTEND_CONTENT_URL + 'configuration.json';

    constructor(private http: HttpClient) {}

    getAvailability(): Observable<number[]> {
        return this.http.get<number[]>(this.availabilityUrl);
    }

    getConfiguration(): Observable<Configuration> {
        return this.http.get<Configuration>(this.configurationUrl);
    }

    getFrontendConfig(): Observable<FrontendConfiguration> {
        return this.http.get<FrontendConfiguration>(this.frontendConfigUrl);
    }
}
