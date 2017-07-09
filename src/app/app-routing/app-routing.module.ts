import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserOrderComponent } from '../user-order/user-order.component'
import { UserOverviewComponent } from '../user-overview/user-overview.component'
import { LoginComponent } from '../login/login.component'

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users/:username', component: UserOrderComponent },
  { path: 'users', component: UserOverviewComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
