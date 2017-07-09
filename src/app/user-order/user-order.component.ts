import { Component, OnInit, ViewChild } from '@angular/core';

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

import { Drink } from '../drink'

export interface IConfirmationModal {
  drink: Drink
}

@Component({
  selector: 'user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.css']
})
export class UserOrderComponent implements OnInit {
  @ViewChild('confirmationTemplate')
  public confirmationTemplate: ModalTemplate<IConfirmationModal, void, void>

  drinks: Drink[] = (() => {
    return [0,1,2,3,4,5,6,7,8].map(id =>
      new Drink(`${id}`, `Drink ${id}`, (id / 8) + 0.7, (id / 8) + 1, 10, null, 0, '')
    )
  })()

  constructor(public modalService: SuiModalService) { }

  ngOnInit() {
  }

  onClick(drink: Drink) {
    const config = new TemplateModalConfig<IConfirmationModal, void, void>(this.confirmationTemplate)

    config.context = { drink }
    config.size = 'small'

    this.modalService
      .open(config)
      .onApprove(() => console.log('approved'))
  }
}
