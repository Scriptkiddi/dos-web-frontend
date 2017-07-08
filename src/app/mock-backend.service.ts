import { Injectable } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions, Response, RequestMethod, Headers } from '@angular/http';

import { User } from './user'

@Injectable()
export class MockBackendService {
  private readonly logins = {
    'zer0': 'password',
    'rootUserAdmin': '1337'
  }

  private readonly tokens: { [username: string]: string } = { }

  private readonly users: User[] = [
    new User('zer0', 'Zer0', 10, { pathDrinkAll: false, modSupplier: false, modDrink: false, modUser: false, setOwnPass: false }),
    new User('rootUserAdmin', 'Admin', 1e10, { pathDrinkAll: true, modSupplier: true, modDrink: true, modUser: true, setOwnPass: true })
  ]

  constructor(private backend: MockBackend) { }

  generateToken() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  }

  start() {
    this.backend.connections.subscribe((c: MockConnection) => {
      console.log('INCOMING REQUEST')
      console.dir(c)

      const URL = 'http://localhost:4200/'
      if (c.request.url === '/token' && c.request.method === RequestMethod.Post) {
        try {
          const [_, username, password] = c.request.getBody().match(/username=([^&]+)&password=(.*)/)
          console.dir([username, password])
          if (!this.logins[username] || this.logins[username] !== password) {
            console.log('invalid credentials')
            return c.mockRespond(new Response(new ResponseOptions({
              body: '{}',
              status: 401,
              headers: new Headers({ 'Content-Type': 'application/json' })
            })))
          }
          const token = this.tokens[username] || this.generateToken()
          this.tokens[username] = token
          console.log('success')
          return c.mockRespond(new Response(new ResponseOptions({
              body: `{"token":"${token}"}`,
              headers: new Headers({ 'Content-Type': 'application/json' })
          })))
        } catch (e) {
          console.log('malformed request')
          return c.mockRespond(new Response(new ResponseOptions({
            body: '{}',
            status: 400,
            headers: new Headers({ 'Content-Type': 'application/json' })
          })))
        }
      }

      // Default to 404
      return c.mockRespond(new Response(new ResponseOptions({
        body: '{"message":"not found"}',
        status: 404,
        headers: new Headers({ 'Content-Type': 'application/json' })
      })))
    })
  }
}
