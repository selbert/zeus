import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { JhiAdminComponent } from 'app/layouts';
import { adminState } from 'app/admin';
import { SelfServiceComponent } from 'app/shop/self-service.component';
import { SelfServiceLandscapeComponent } from 'app/shop/self-service-landscape.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    redirectTo: '/self-service/ln-pos',
                    pathMatch: 'full'
                },
                {
                    path: 'self-service/:id',
                    component: SelfServiceComponent
                },
                {
                    path: 'self-service-landscape',
                    redirectTo: '/self-service-landscape/ln-pos',
                    pathMatch: 'full'
                },
                {
                    path: 'self-service-landscape/:id',
                    component: SelfServiceLandscapeComponent
                },
                {
                    path: 'admin',
                    component: JhiAdminComponent,
                    children: adminState
                }
            ],
            { useHash: true, enableTracing: DEBUG_INFO_ENABLED }
        )
    ],
    exports: [RouterModule]
})
export class LnPosAppRoutingModule {}
