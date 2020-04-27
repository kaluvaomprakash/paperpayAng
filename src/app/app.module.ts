import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CustomersComponent } from './customers/customers.component';
import { StatementComponent } from './statement/statement.component';
import { CookieService } from 'angular2-cookie/core';
import { RestServiceService } from './rest-service.service';
import { NewspapersComponent } from './newspapers/newspapers.component';
import { ACustomerComponent } from './a-customer/a-customer.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
 import {ToastrModule} from 'ngx-toastr'
import { TimeoutError } from 'rxjs';
import { NavsidebarComponent } from './navsidebar/navsidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    CustomersComponent,
    StatementComponent,
    NewspapersComponent,
    ACustomerComponent,
    NewCustomerComponent,
    NavsidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule, // required animations module
     ToastrModule.forRoot(
     {
       timeOut:1000,
       progressBar:true,
       progressAnimation:"increasing",
       preventDuplicates:true
     }

     ) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
