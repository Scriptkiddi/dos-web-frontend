import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AuthenticationService } from './authentication.service';
import { DrinksService } from './drinks.service'
import { UserService } from './user.service';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { ObjectKeysPipe } from './object-keys.pipe'
import { UserOrderComponent } from './user-order/user-order.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserOverviewComponent,
    ObjectKeysPipe,
    UserOrderComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    SuiModule,
    AppRoutingModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    DrinksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
