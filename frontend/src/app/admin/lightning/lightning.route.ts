import { Route } from '@angular/router';

import { JhiLightningComponent } from './lightning.component';

export const lightningRoute: Route = {
    path: 'jhi-lightning',
    component: JhiLightningComponent,
    data: {
        pageTitle: 'Lightning Network status'
    }
};
