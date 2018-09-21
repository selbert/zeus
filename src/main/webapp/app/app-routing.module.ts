import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { JhiAdminComponent } from 'app/layouts';
import { adminState } from 'app/admin';
import { SelfServiceComponent } from 'app/shop/self-service.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    redirectTo: '/self-service',
                    pathMatch: 'full'
                },
                {
                    path: 'self-service',
                    component: SelfServiceComponent
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
