import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from './user'
import { PERMISSIONS_ENDPOINT } from './app-settings'

type Role = {
  Type: string,
  PatchDrinkEveryone: boolean,
  ModSuppliers: boolean,
  ModDrink: boolean,
  ModUser: boolean,
  SetOwnPassword: boolean
}

@Injectable()
export class AuthorizationService {
  private roles: { [name: string]: Role } = null

  constructor(private http: Http) { }

  private async getRoles(): Promise<{ [name: string]: Role }> {
    if (this.roles) return this.roles

    const rolenames = await this.http.get(PERMISSIONS_ENDPOINT)
      .toPromise()
      .then(res => {
        if (res.status >= 400) throw res.json()
        return res.json() as string[]
      })

    const roles = await Promise.all(rolenames.map(name =>
      this.http.get(`${PERMISSIONS_ENDPOINT}/${name}`)
        .toPromise()
        .then(res => {
          if (res.status >= 400) throw res.json()
          return res.json() as Role
        })
    ))

    this.roles = roles.reduce((acc: { [name: string]: Role }, role: Role) => {
      acc[role.Type] = role
      return acc
    }, { })

    return this.roles
  }

  async hasPatchDrinkEveryone(user: User): Promise<boolean> {
    const permissions = await this.getRoles()
    return permissions[user.Permissions || 'user'].PatchDrinkEveryone
  }
}
