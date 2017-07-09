import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Drink } from './drink'
import { API_ENDPOINT } from './app-settings'

@Injectable()
export class DrinksService {
  private readonly drinkEndpoint =`${API_ENDPOINT}/drink`

  constructor(private http: Http) { }

  getAll(): Promise<string[]> {
    return this.http.get(this.drinkEndpoint, this.requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
        return res.json() as string[]
      })
  }

  getByEAN(ean: string): Promise<Drink> {
    return this.http.get(`${this.drinkEndpoint}/${ean}`, this.requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
        return res.json() as Drink
      })
  }

  order(ean: string): Promise<void> {
    return this.http.delete(`${this.drinkEndpoint}/${ean}`, this.requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
      })
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
