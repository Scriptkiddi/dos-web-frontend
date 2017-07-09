import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user'
import { UserService } from './user.service'
import { ActiveUsersService } from './active-users.service'
import { TOKEN_ENDPOINT, USERS_ENDPOINT } from './app-settings'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthenticationService {
  constructor(
    private http: Http,
    private router: Router
  ) { }

  private primaryUser: User
  private activeUser: User

  async getPrimaryUser(): Promise<User> {
    if (this.primaryUser) return this.primaryUser
    if (localStorage.getItem('token')) {
      try {
        const user = await this.getUserFromToken()
        this.primaryUser = user
        this.activeUser = null
        return user
      } catch (_) { }
    }
    throw 'User not logged in'
  }

  async getActiveUser(): Promise<User> {
    if (this.activeUser) return this.activeUser
    return await this.getPrimaryUser()
  }

  setActiveUser(user: User) {
    this.activeUser = user
  }

  async login(username: string, password: string): Promise<User> {
    try {
      await this.logout()
    } catch (_) { }

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
    return await this.getActiveUser()
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token')
    this.primaryUser = null
    this.activeUser = null

    await this.http.delete(TOKEN_ENDPOINT, new RequestOptions({
      headers: this.authHeaders
    })).toPromise()
  }

  getUserFromToken(): Promise<User> {
    if (!localStorage.getItem('token')) throw 'No token set'
    return this.http.get(`${USERS_ENDPOINT}/_self`, new RequestOptions({
      headers: this.authHeaders
    }))
    .toPromise()
    .then(res => {
      if (res.status >= 400) throw res.json()
      return res.json() as User
    })
  }

  async refreshPrimaryUser(): Promise<User> {
    return this.primaryUser = await this.getUserFromToken()
  }

  async refreshActiveUser(): Promise<User> {
    if (!this.activeUser) {
      this.activeUser = await this.refreshPrimaryUser()
    }
    const user = await this.http.get(`${USERS_ENDPOINT}/${this.activeUser.Username}`, new RequestOptions({
      headers: this.authHeaders
    }))
    .toPromise()
    .then(res => {
      if (res.status >= 400) throw res.json()
      return res.json() as User
    })

    this.activeUser = user
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
