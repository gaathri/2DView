import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountHomeComponent } from './account-home/account-home.component';
//import { AuthGuard } from '../core/authentication/auth.guard';


@NgModule({
  declarations: [AccountHomeComponent, LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class AccountModule { }
