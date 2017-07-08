import { Injectable } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions, Response, RequestMethod, Headers } from '@angular/http';

import { User } from './user'

@Injectable()
export class MockBackendService {
  private readonly jsonHeaders = new Headers({ 'Content-Type': 'application/json' })

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
    const requestHandlers: [RequestMethod, string, (c: MockConnection) => void][] = [
      [RequestMethod.Post, '/token', this.handleTokenRequest],
    ]
    const notFoundHandler = (c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({
      body: '{"message":"not found"}',
      status: 404,
      headers: this.jsonHeaders
    })))

    this.backend.connections.subscribe((c: MockConnection) => {
      try {
        const requestHandler = requestHandlers
          .find(([method, path, _]) => method === c.request.method && path === c.request.url)
        const handler = (requestHandler && requestHandler[2]) || notFoundHandler
        handler(c)
      } catch (e) {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{}',
          status: 400,
          headers: this.jsonHeaders
        })))
      }
    })
  }

  handleTokenRequest(c: MockConnection) {
    const [_, username, password] = c.request.getBody().match(/username=([^&]+)&password=(.*)/)
    if (!this.logins[username] || this.logins[username] !== password) {
      return c.mockRespond(new Response(new ResponseOptions({
        body: '{}',
        status: 401,
        headers: this.jsonHeaders
      })))
    }
    const token = this.tokens[username] || this.generateToken()
    this.tokens[username] = token
    return c.mockRespond(new Response(new ResponseOptions({
        body: `{"token":"${token}"}`,
        headers: this.jsonHeaders
    })))
  }
}
