import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user'

@Injectable()
export class UserService {
  private readonly userEndpoint = '/user'

  constructor(private http: Http) { }

  getAll(): Promise<string[]> {
    return this.http.get(this.userEndpoint, this.requestOptions)
      .toPromise()
      .then(response => response.json() as string[])
  }

  getSelf(): Promise<User> {
    return this.getByUsername('_self_')
  }

  getByUsername(username: string): Promise<User> {
    return this.http.get(`${this.userEndpoint}/${username}`, this.requestOptions)
      .toPromise()
      .then(response => response.json() as User)
  }

  private get requestOptions(): RequestOptions {
    const token = localStorage.getItem('token')
    if (token) {
      const headers = new Headers({ 'X-Tocken': token })
      return new RequestOptions({ headers })
    } else {
      return null
    }
  }
}
