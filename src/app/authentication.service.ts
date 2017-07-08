import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthenticationService {
  private readonly tokenEndpoint = '/token'

  constructor(private http: Http) { }

  async login(username: string, password: string): Promise<void> {
    const { token }: { token: string } = await this.http
      .post(this.tokenEndpoint, JSON.stringify({ username, password }))
      .toPromise()
      .then(res => res.json())

    localStorage.setItem('token', token)
  }

  async logout(): Promise<void> {
    // TODO: delete token on server
    localStorage.removeItem('token')
  }
}
