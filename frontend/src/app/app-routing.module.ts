import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { JhiAdminComponent } from 'app/layouts';
import { adminState } from 'app/admin';
import { SelfServiceComponent } from 'app/shop/self-service.component';
import { BeerTapComponent } from 'app/shop/beer-tap.component';
import { DonateComponent } from 'app/donate/donate.component';
import { ShopComponent } from 'app/shop/shop.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    redirectTo: '/self-service/zeus',
                    pathMatch: 'full'
                },
                {
                    path: 'self-service',
                    redirectTo: '/self-service/zeus',
                    pathMatch: 'full'
                },
                {
                    path: 'self-service/:id',
                    component: SelfServiceComponent
                },
                {
                    path: 'beer-tap',
                    redirectTo: '/beer-tap/beerTapSingle',
                    pathMatch: 'full'
                },
                {
                    path: 'beer-tap/:id',
                    component: BeerTapComponent
                },
                {
                    path: 'donate',
                    redirectTo: '/donate/zeus',
                    pathMatch: 'full'
                },
                {
                    path: 'donate/:id',
                    component: DonateComponent
                },
                {
                    path: 'shop',
                    component: ShopComponent
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
export class ZeusAppRoutingModule {}
