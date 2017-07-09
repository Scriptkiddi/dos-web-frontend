import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = null
  loginRunning: boolean = false

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn) {
      this.loginSuccessful()
    }
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

  loginSuccessful() {
    // TODO: Redirect to user-order or user-overview, depending on PatchDrinkEveryone permission.
  }
}
