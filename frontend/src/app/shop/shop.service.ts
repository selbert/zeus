import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FRONTEND_CONTENT_URL, getServerUrl } from 'app/app.constants';
import { Configuration, FrontendConfiguration } from 'app/shared/model/product.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
    private availabilityUrl = getServerUrl() + 'api/shop/available';
    private configurationUrl = getServerUrl() + 'api/shop/configuration';
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
