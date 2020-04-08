import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor() { }
  newUser: {
    "mobileNumber": "", "password": "",
    "serviceCharge": 10, "name": "", "isActive": 1,"email":""
  }
  ngOnInit() {
  }

}
