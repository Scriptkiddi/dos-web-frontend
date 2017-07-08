import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user'
import { API_ENDPOINT } from './app-settings'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthenticationService {
  private readonly tokenEndpoint = `${API_ENDPOINT}/token`

  constructor(private http: Http) { }

  async login(username: string, password: string): Promise<void> {
    const { token }: { token: string } = await this.http
      .post(this.tokenEndpoint, `username=${username}&password=${password}`, new RequestOptions({
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
      }))
      .toPromise()
      .then(res => {
        console.log(res)
        if (res.status >= 400) {
          throw res.json()
        }
        return res.json()
      })

    localStorage.setItem('token', token)
  }

  async logout(): Promise<void> {
    // TODO: delete token on server
    localStorage.removeItem('token')
  }
}
