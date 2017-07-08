import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

// TODO: remove when the API-server is live
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';

import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // HttpModule, // TODO: re-enable when the API-server is live
    BrowserModule,
    SuiModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    MockBackend,
    BaseRequestOptions,
    {
      provide: Http,
      deps: [ MockBackend, BaseRequestOptions ],
      useFactory: (backend, options) => new Http(backend, options)
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
