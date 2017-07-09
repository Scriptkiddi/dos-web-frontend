import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Drink } from './drink'
import { AuthenticationService } from './authentication.service'
import { DRINKS_ENDPOINT } from './app-settings'

@Injectable()
export class DrinksService {
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  getAll(): Promise<string[]> {
    return this.http.get(DRINKS_ENDPOINT, this.requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
        return res.json() as string[]
      })
  }

  getAllFull(): Promise<Drink[]> {
    return this.getAll()
      .then(eans => eans.map(ean => this.getByEAN(ean)))
      .then(requests => Promise.all(requests))
  }

  getByEAN(ean: string): Promise<Drink> {
    return this.http.get(`${DRINKS_ENDPOINT}/${ean}`, this.requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
        return res.json() as Drink
      })
  }

  drink(ean: string): Promise<void> {
    const requestOptions = this.requestOptions
    console.dir(requestOptions)
    return this.http.post(`${DRINKS_ENDPOINT}/${ean}/order`, null, requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res
      })
      .catch(res => { console.dir(res); throw res.json() })
  }

  drinkForUser(ean: string, uid: string): Promise<void> {
    return this.http.post(`${DRINKS_ENDPOINT}/${ean}/order/${uid}`, null, this.requestOptions)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
      })
  }

  private get requestOptions(): RequestOptions {
    return new RequestOptions({ headers: this.authenticationService.authHeaders })
  }
}
