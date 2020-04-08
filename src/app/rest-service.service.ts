import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { CookieService } from 'angular2-cookie/core';



@Injectable({
  providedIn: 'root'
})

export class RestServiceService {

  constructor(private http: HttpClient) { }
  postResponseData: any;
  public token: String = document.cookie;

  //token
  hackerLoginsubmit(mobileno, password): Observable<RestServiceService[]> {
    let url = "http://localhost:8080/spring-crm-rest/hacker/check/" + mobileno + "/" + password
    //customers components 
    //let getCustomersUrl=
    return this.http.get<RestServiceService[]>(url);
  }
  postData(posturl, data): Observable<any> {
    var userToken = this.extractToken();
    console.log("userToken " + userToken);
    return this.http.post(posturl, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken
      })
    });
  }
  extractToken() {
    return document.cookie.split("=")[1];
  }

  getCallwithOut(url) : Observable<RestServiceService[]>{
    return this.http.get<RestServiceService[]>(url);
  }
  getCustomers(url): Observable<RestServiceService[]> {
    // var userToken = this.cookie.get('PPtoken');
    var userToken = this.extractToken();
    console.log("userToken " + userToken);
    return this.http.get<RestServiceService[]>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken
      })
    }


    );
  }
  updateCall(puturl, data) {
    this.http.put(puturl, data).subscribe(data => {
      console.log("updated successful " + data);
    })
  }
  putCallWithObserable(puturl, data): Observable<RestServiceService[]> {
    debugger;
    return this.http.post<RestServiceService[]>(puturl, data)
  }



}
