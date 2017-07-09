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

  private get requestOptions(): RequestOptions {
    return new RequestOptions({ headers: this.authenticationService.authHeaders })
  }
}
