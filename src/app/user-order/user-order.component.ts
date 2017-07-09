import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

import { Drink } from '../drink'
import { DrinksService } from '../drinks.service'
import { User } from '../user'
import { UserService } from '../user.service'

export interface IConfirmationModal {
  drink: Drink,
  activeUser: User
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

  activeUser: User = null

  constructor(
    private modalService: SuiModalService,
    private drinksService: DrinksService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.userService.getByUsername(params.get('username')))
      .subscribe(activeUser => {
        this.activeUser = activeUser
      }, err => this.displayError(err))

    this.drinksService.getAll()
      .then(drinks => drinks.map(ean => this.drinksService.getByEAN(ean)))
      .then(drinkRequests => Promise.all(drinkRequests))
      .then(drinks => this.drinks = drinks)
      .then(() => this.loading = false)
      .catch(err => {
        this.displayError(err)
        this.loading = false
      })
  }

  onClick(drink: Drink) {
    const config = new TemplateModalConfig<IConfirmationModal, Drink, void>(this.confirmationTemplate)

    config.context = { drink, activeUser: this.activeUser }
    config.size = 'small'

    this.modalService
      .open(config)
      .onApprove((drink: Drink) => {
        this.loading = true
        this.drinksService.order(drink.ean)
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
