import { Component } from '@angular/core';
import { Router } from '@angular/router'

import { AuthenticationService } from './authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  logout() {
    this.authenticationService.logout().catch(() => { }).then(() => {
      this.router.navigate(['/'])
    })
  }

  goBack() {
    this.authenticationService.setActiveUser(null)
    this.router.navigate(['../'])
  }
}
