import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user'
import { AuthenticationService } from './authentication.service'
import { USERS_ENDPOINT } from './app-settings'

@Injectable()
export class UserService {
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  getAll(): Promise<string[]> {
    return this.http.get(USERS_ENDPOINT, this.requestOptions)
      .toPromise()
      .then(response => response.json() as string[])
  }

  getSelf(): Promise<User> {
    return this.getByUsername('_self_')
  }

  getByUsername(username: string): Promise<User> {
    return this.http.get(`${USERS_ENDPOINT}/${username}`, this.requestOptions)
      .toPromise()
      .then(response => response.json() as User)
  }

  async depositMoney(username: string, amount: number): Promise<void> {
    console.log(amount)
    console.log((new Error()).stack)
    const user = await this.authenticationService.getActiveUser()
    user.Credit += amount
    return this.http.patch(`${USERS_ENDPOINT}/${username}`, JSON.stringify({credit: 10}), this.requestOptions)
      .toPromise()
      .then(() => {
        this.authenticationService.refreshActiveUser()
        this.authenticationService.refreshPrimaryUser()
      })
  }

  private get requestOptions(): RequestOptions {
    return new RequestOptions({ headers: this.authenticationService.authHeaders })
  }
}
