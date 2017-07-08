import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
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
