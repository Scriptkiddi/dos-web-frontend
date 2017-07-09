import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router'

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui'

import { AuthenticationService } from './authentication.service'
import { User } from './user'
import { UserService } from './user.service'

export interface IDepositModal {
  user: User
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('depositTemplate')
  public depositTemplate: ModalTemplate<IDepositModal, number, void>

  title = 'app';

  constructor(
    private modalService: SuiModalService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  logout() {
    this.authenticationService.logout().catch(() => { }).then(() => {
      this.router.navigate(['/'])
    })
  }

  goBack() {
    this.authenticationService.setActiveUser(null)
    this.router.navigate(['../'])
  }

  deposit() {
    this.authenticationService.getActiveUser()
      .then(user => {
        const config = new TemplateModalConfig<IDepositModal, number, void>(this.depositTemplate)
        config.context = { user }
        config.size = 'small'
        this.modalService.open(config)
          .onApprove((amount: number) => {
            this.userService.depositMoney(user.Username, amount)
            // this.authenticationService.refreshActiveUser()
            // this.authenticationService.refreshPrimaryUser()
          })
      })
  }
}
