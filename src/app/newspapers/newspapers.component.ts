import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../rest-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newspapers',
  templateUrl: './newspapers.component.html',
  styleUrls: ['./newspapers.component.css']
})
export class NewspapersComponent implements OnInit {

  constructor(private restService: RestServiceService, private modalService: NgbModal
    , private toaster: ToastrService) { }
  hackerProduct = [];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  thisMonth;
  navClickHeading: String = "Newspapers";
  sheffalTabs: boolean = true;
  viewOneProduct;
  lines;
  line = { "name": "" };
  lineType: String;
  linebuttonType: String = "Add";
  clickedLineId
  //methods
  OpenProductModal(itm, content) {
    console.log("data " + JSON.stringify(itm));
    this.viewOneProduct = itm;
    this.viewOneProduct.product.productPrice = JSON.parse(this.viewOneProduct.product.productPrice)
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  listOfHackerProduct() {
    var lid = JSON.parse(localStorage.getItem("lastname"));
   // var getlines = "http://localhost:8080/spring-crm-rest/Customers/p/custCountPrduct/" + lid.hacker_id;
   var getlines = "http://localhost:8080/nestpay/products/custCountinProdct"
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        debugger;
        // this.hackerProduct = this.AmountForMonth(data);;
        this.hackerProduct = data;
        //console.log("data "+JSON.stringify(data));
      });
  }

  onClickNavNewsPapers(item) {
    this.navClickHeading = item;
    if (item == "Newspapers") {
      this.sheffalTabs = true;
    } else {
      this.sheffalTabs = false;
      this.Listlines();
    }
  }
  AmountForMonth(details) {
    debugger
    var days1 = this.countDays();
    for (var a = 0; details.length; a++) {
      //debugger;
      if (details[a].product.productType == "weekWise") {
        var monthlyBill = 0;
        var oneproduct = JSON.parse(details[a].product.productPrice);
        for (var da in days1) {
          monthlyBill += days1[da] * oneproduct[da]
        }
        details[a]["monthPriceOfProduct"] = monthlyBill;
      }
    }
    console.log("details " + JSON.stringify(details));
    return details;
  }

  Listlines() {
    //  debugger;
    var lid = JSON.parse(localStorage.getItem("lastname"));
    //var getlines = "http://localhost:8080/spring-crm-rest/lines/lin/"  + lid.hacker_id;
    var getlines = "http://localhost:8080/nestpay/lines/customerInLines"
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        this.lines = data;
      });
  }
  countDays() {
    debugger;
    let date = new Date();
    let noOfDysInMnth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    var sun = 0, mon = 0, tue = 0, wednes = 0, thurs = 0, fri = 0, sat = 0;
    var MonthlyWeekCounts = {};
    for (var i = 0; i < noOfDysInMnth; i++) {
      var date1 = new Date(date.getFullYear(), date.getMonth(), i);
      if (date1.getDay() === 0) sun++;
      if (date1.getDay() === 1) mon++;
      if (date1.getDay() === 2) tue++;
      if (date1.getDay() === 3) wednes++;
      if (date1.getDay() === 4) thurs++;
      if (date1.getDay() === 5) fri++;
      if (date1.getDay() === 6) sat++;
    }
    var countOfDaysinMonths = {};
    countOfDaysinMonths["mon"] = mon, countOfDaysinMonths["tue"] = tue,
      countOfDaysinMonths["wednes"] = wednes, countOfDaysinMonths["thur"] = thurs,
      countOfDaysinMonths["fri"] = fri, countOfDaysinMonths["sat"] = sat, countOfDaysinMonths["sun"] = sun;
    return countOfDaysinMonths;
  }
  deleteline(id) {
    console.log(id)
    var url = "http://localhost:8080/nestpay/lines/removeline/" + id
    //ngthis.restService.delete(url).subscribe(()=>{});
  }
  addLine(line, buttontype) {

    console.log(JSON.stringify(line) + " " + buttontype);
    console.log("line" + JSON.stringify(line));
    if (buttontype == "Add") {
      var url = "http://localhost:8080/nestpay/lines/removeline";
      this.restService.postData(url, (line)).subscribe(
        (data) => {
          this.toaster.success("Line Added successfully", "Success");
          this.Listlines();
          console.log(data);
        });
    }
    else {
      debugger;
      console.log("inelse" + JSON.stringify(line));
      line["id"] = this.clickedLineId;
      var url = "http://localhost:8080/nestpay/lines/updateLine";
      this.restService.updateCall(url, line).subscribe(
        (date) => {
          this.toaster.success("Line updated successfully", "Success");
          this.Listlines();
          this.lines.name = '';
        });
    }

  }

  openLineModal(openlineModla, lineTyp, lineDet) {
    console.log(" line " + JSON.stringify(lineDet));
    // this.line.lineName = lineDet.lineName;
    if (lineTyp == 'addLine') { this.lineType = "Create"; this.linebuttonType = "Add"; }
    else { this.lineType = "Edit"; this.linebuttonType = "Update"; this.clickedLineId = lineDet.line.id; this.line.name = lineDet.line.name }
    this.modalService.open(openlineModla, { centered: true, size: 'sm' });
  }

  ngOnInit() {
    var date = new Date();
    this.thisMonth = this.monthNames[date.getMonth()];
    this.listOfHackerProduct();
    
  }

}
