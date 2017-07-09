import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { AuthenticationService } from '../authentication.service'
import { AuthorizationService } from '../authorization.service'
import { ActiveUsersService } from '../active-users.service'

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = null
  loginRunning: boolean = false

  constructor(
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticationService.getPrimaryUser().then(() => this.loginSuccessful())
  }

  login(username: string, password: string) {
    this.hideError()
    if (!username || !username.trim() || !password) {
      this.displayError('Nutzername und Passwort dürfen nicht leer sein.')
      return
    }
    this.loginRunning = true
    this.authenticationService.login(username, password)
      .then(() => {
        this.hideError()
        this.loginSuccessful()
      })
      .catch(err => {
        this.displayError(err)
        this.loginRunning = false
      })
  }

  displayError(message: string) {
    this.errorMessage = message
  }

  hideError() {
    this.errorMessage = null
  }

  async loginSuccessful(): Promise<void> {
    const user = await this.authenticationService.getPrimaryUser()
    if (await this.authorizationService.hasPatchDrinkEveryone(user)) {
      this.router.navigate(['/users'])
    } else {
      this.authenticationService.setActiveUser(user)
      this.router.navigate(['/users', user.Username])
    }
  }
}
