import { Component, OnInit, ViewChild } from '@angular/core';

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

import { Drink } from '../drink'
import { DrinksService } from '../drinks.service'

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
  public confirmationTemplate: ModalTemplate<IConfirmationModal, Drink, void>

  drinks: Drink[] = []

  loading = false
  errorMessage: string = null

  constructor(
    public modalService: SuiModalService,
    public drinksService: DrinksService
  ) { }

  ngOnInit() {
    this.drinksService.getAll()
      .then(drinks => drinks.map(ean => this.drinksService.getByEAN(ean)))
      .then(Promise.all)
      .then(drinks => this.drinks = drinks)
      .then(() => this.loading = false)
      .catch(err => {
        this.displayError(err)
        this.loading = false
      })
  }

  onClick(drink: Drink) {
    const config = new TemplateModalConfig<IConfirmationModal, Drink, void>(this.confirmationTemplate)

    config.context = { drink }
    config.size = 'small'

    this.modalService
      .open(config)
      .onApprove((drink: Drink) => {
        this.loading = true
        this.drinksService.order(drink.EAN)
          .then(() => {
            this.loading = false
            // TODO: If PatchDrinkEveryone permission is set, redirect to user overview
          })
          .catch(err => {
            this.loading = false
            this.displayError(err)
          })
      })
  }

  displayError(message: string) {
    this.errorMessage = message
  }

  hideError() {
    this.errorMessage = null
  }
}
