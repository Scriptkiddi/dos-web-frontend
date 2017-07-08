import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    SuiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
