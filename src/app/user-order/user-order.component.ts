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
    this.route.paramMap.map((params: ParamMap) => params.get('username'))
      .subscribe(username => {
        this.userService.getByUsername(username)
          .catch(err => {
            if (err.status === 401) {
              return this.authenticationService.getActiveUser()
            } else if (err.status === 404) {
              this.router.navigate(['/users'])
            }
            throw err
          })
          .then(user => this.activeUser = user)
          .then(() => this.drinksService.getAllFull())
          .then(drinks => {
            this.drinks = drinks
          })
          .catch(err => {
            this.displayError(err)
          })
          .then(() => this.loading = false)
      }, err => {
        this.displayError(err)
        this.loading = false
      })

    // this.route.paramMap
    //   .switchMap((params: ParamMap) => this.userService.getByUsername(params.get('username')))
    //   .subscribe(activeUser => {
    //     console.dir(activeUser)
    //     this.activeUser = activeUser
    //   }, err => {
    //     if (err.status === 401) {
    //       this.router.navigate(['/users', '_self'])
    //       // this.authenticationService.getActiveUser()
    //       //   .then(user => { console.dir(user); return user })
    //       //   .then(user => this.router.navigate(['/users', user.uid]))
    //       //   .catch(err => {
    //       //     this.displayError(err)
    //       //   })
    //     } else {
    //       this.displayError(err)
    //     }
    //   })

    // this.drinksService.getAll()
    //   .then(drinks => drinks.map(ean => this.drinksService.getByEAN(ean)))
    //   .then(drinkRequests => Promise.all(drinkRequests))
    //   .then(drinks => this.drinks = drinks)
    //   .then(() => this.loading = false)
    //   .catch(err => {
    //     this.displayError(err)
    //     this.loading = false
    //   })
  }

  onClick(drink: Drink) {
    const config = new TemplateModalConfig<IConfirmationModal, Drink, void>(this.confirmationTemplate)

    config.context = { drink, activeUser: this.activeUser }
    config.size = 'small'

    this.modalService
      .open(config)
      .onApprove((drink: Drink) => {
        this.loading = true
        this.drinksService.drink(drink.EAN)
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
