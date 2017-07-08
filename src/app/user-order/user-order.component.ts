import { Component, OnInit } from '@angular/core';

import { Drink } from '../drink'

@Component({
  selector: 'user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.css']
})
export class UserOrderComponent implements OnInit {
  drinks: Drink[] = (() => {
    return [0,1,2,3,4,5,6,7,8].map(id =>
      new Drink(`${id}`, `Drink ${id}`, (id / 8) + 0.7, (id / 8) + 1, 10, null, 0, '')
    )
  })()

  constructor() { }

  ngOnInit() {
  }

}
