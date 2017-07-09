import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user'
import { UserService } from './user.service'
import { TOKEN_ENDPOINT, USERS_ENDPOINT } from './app-settings'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthenticationService {
  private user: User = null

  constructor(
    private http: Http,
    private router: Router
  ) { }

  async login(username: string, password: string): Promise<void> {
    const { token }: { token: string } = await this.http
      .get(TOKEN_ENDPOINT, new RequestOptions({
        headers: new Headers({ 'Authorization': `Basic ${btoa(`${username}:${password}`)}` })
      }))
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
        return res.json()
      })

    localStorage.setItem('token', token)
    await this.refreshUser()
  }

  async logout(): Promise<void> {
    try {
      await this.http.delete(TOKEN_ENDPOINT, new RequestOptions({
        headers: this.authHeaders
      })).toPromise()
    } catch (_) { }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.user = null

    this.router.navigate(['/'])
  }

  async getActiveUser(): Promise<User> {
    return this.user || await this.refreshUser()
  }

  get isLoggedIn(): boolean {
    return typeof localStorage.getItem('token') === 'string'
  }

  async refreshUser(): Promise<User> {
    const user = await this.http.get(`${USERS_ENDPOINT}/_self`, new RequestOptions({
      headers: this.authHeaders
    }))
    .toPromise()
    .then(res => {
      if (res.status >= 400) throw res.json()
      return res.json() as User
    })

    localStorage.setItem('user', JSON.stringify(user))
    this.user = user
    return user
  }

  get authHeaders(): Headers {
    return this.addAuthHeader(new Headers())
  }

  addAuthHeader(inputHeaders?: Headers | { [name: string]: any }): Headers {
    const headers = new Headers(inputHeaders)
    const token = localStorage.getItem('token')
    if (token) {
      headers.append('Authorization', `Bearer ${btoa(token)}`)
    }
    return headers
  }
}
