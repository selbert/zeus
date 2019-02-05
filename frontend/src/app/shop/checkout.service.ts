import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
    private availabilityUrl = SERVER_API_URL + 'api/shop/available';

    constructor(private http: HttpClient) {}

    getAvailability() {
        return this.http.get(this.availabilityUrl);
    }
}
