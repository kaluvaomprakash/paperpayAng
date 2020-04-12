import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../rest-service.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private restService: RestServiceService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
  }
  loginFail = false;
  logindata;
  loginSubmit(userEnterdDetails) {
    var url = "http://localhost:8080/nestpay/hacker/check/"
    +userEnterdDetails.mobileNumber+"/"+userEnterdDetails.password;
    this.restService.getCallwithOut(url).subscribe(responseData => {
      console.log("POST Request is successful ", responseData);
      this.logindata = responseData
      if (this.logindata.count == '1') {
        debugger
        var day = new Date();
        console.log(day);
        var nextDay = new Date(day);
         nextDay.setDate(day.getDate() + 1);
        console.log(nextDay);
        document.cookie = "PPtoken="+this.logindata.token+"; expires=nextDay; path=/;";
        localStorage.setItem("lastname", JSON.stringify(this.logindata));
        this.router.navigateByUrl('newcustomers');
      }
      else {
        this.loginFail = true;
      }
    },
      error => {
        console.log("Error", error);
      });

  }

}
