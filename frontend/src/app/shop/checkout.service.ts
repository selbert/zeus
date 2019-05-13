import { Injectable } from '@angular/core';
import { getServerUrl } from 'app/app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
    private availabilityUrl = getServerUrl() + 'api/shop/available';

    constructor(private http: HttpClient) {}

    getAvailability() {
        return this.http.get(this.availabilityUrl);
    }
}
