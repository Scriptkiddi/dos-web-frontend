import { Component } from '@angular/core';

import { MockBackendService } from './mock-backend.service'
import { AuthenticationService } from './authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    MockBackendService,
    AuthenticationService
  ]
})
export class AppComponent {
  title = 'app';

  constructor(
    private mockBackendService: MockBackendService,
    private authenticationService: AuthenticationService
  ) {
    this.mockBackendService.start()
  }
}
