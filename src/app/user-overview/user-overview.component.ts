import { Component, OnInit } from '@angular/core';

import { User } from '../user'

@Component({
  selector: 'user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {
  readonly letters = (() => {
    const letters: string[] = []
    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
      letters.push(String.fromCharCode(i))
    }
    return letters
  })()

  usersByLetter: { [letter: string]: User[] } = (() => {
    let turn = 0
    return this.letters.reduce((acc, letter) => {
      if (turn++ % 3 === 2) return acc
      acc[letter] = [0,1,2,3,4,5,6,7].map(id =>
        new User(`${letter}${id}`, 'User', `${letter.toUpperCase()}${id}`, 10, {
          Type: 'user', ModDrink: false, ModSuppliers: false, ModUser: false, PatchDrinkEveryone: false, SetOwnPassword: false
        })
      )
      return acc
    }, { })
  })()

  constructor() {
  }

  ngOnInit() {
  }

  onClick(user: User) {
    console.log(user.Username)
  }
}
