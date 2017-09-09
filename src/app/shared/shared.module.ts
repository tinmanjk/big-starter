import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterFormComponent } from './navigation/register-form/register-form.component';
import { UserLoginComponent } from './navigation/user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
    ],
    declarations: [
        FooterComponent,
        NavigationComponent,
        UserLoginComponent,
        RegisterFormComponent],
    entryComponents: [
        UserLoginComponent,
        RegisterFormComponent,
    ],
    exports: [
        FooterComponent,
        NavigationComponent,
    ]
})
export class SharedModule { }
