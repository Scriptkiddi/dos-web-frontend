import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/map';

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

import { Drink } from '../drink'
import { DrinksService } from '../drinks.service'
import { User } from '../user'
import { UserService } from '../user.service'
import { AuthenticationService } from '../authentication.service'

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
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true
    this.authenticationService.getActiveUser().then(user => {
      this.activeUser = user
    })
    .then(() => this.loadDrinks())
    .catch(err => {
      this.displayError(err)
    })
    .then(() => this.loading = false)
  }

  onClick(drink: Drink) {
    const config = new TemplateModalConfig<IConfirmationModal, Drink, void>(this.confirmationTemplate)

    config.context = { drink, activeUser: this.activeUser }
    config.size = 'small'

    this.modalService
      .open(config)
      .onApprove((drink: Drink) => {
        this.loading = true
        Promise.all([
          this.authenticationService.getPrimaryUser(),
          this.authenticationService.getActiveUser()
        ])
        .then(([primaryUser, activeUser]) => {
          if (primaryUser.Username === activeUser.Username) {
            return this.drinksService.drink(drink.EAN)
          } else {
            return this.drinksService.drinkForUser(drink.EAN, activeUser.Username)
          }
        })
        .then(async () => {
          await this.loadDrinks()
          await this.updateActiveUser()
          this.loading = false
          this.authenticationService.setActiveUser(null)
          this.router.navigate(['/'])
        })
        .catch(err => {
          this.loading = false
          this.displayError(err)
        })
      })
  }

  async loadDrinks(): Promise<void> {
    this.drinks = await this.drinksService.getAllFull()
  }

  async updateActiveUser(): Promise<void> {
    this.activeUser = await this.userService.getByUsername(this.activeUser.Username)
  }

  displayError(message: string) {
    this.errorMessage = message
  }

  hideError() {
    this.errorMessage = null
  }
}
