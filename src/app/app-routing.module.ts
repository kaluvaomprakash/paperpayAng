import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { StatementComponent } from './statement/statement.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NewspapersComponent } from './newspapers/newspapers.component';
import { ACustomerComponent } from './a-customer/a-customer.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { NavsidebarComponent } from './navsidebar/navsidebar.component';



const routes: Routes = [
{path:'',redirectTo:"/newcustomers",pathMatch:"full"},
{path:"signup",component:SignupComponent},
{path:"login",component:LoginComponent},
{path:"customers",component:CustomersComponent},
{path:"newcustomers",component:NewCustomerComponent},
{path:"statement",component:StatementComponent},
{path:"newspapers",component:NewspapersComponent},
{path:"customer/:id",component:ACustomerComponent},
{path:"home",component:NavsidebarComponent},
{path:"**",component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
