import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    SuiModule
  ],
  providers: [
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
