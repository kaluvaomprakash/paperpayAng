import { Component, OnInit, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestServiceService } from '../rest-service.service';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  //@ViewChildren("showDatePicker") showDatePickerTemplate;
  constructor(private modalService: NgbModal, private restService: RestServiceService, calendar: NgbCalendar,
  ) {

  }
  datePicker;
  frDate: NgbDateStruct; tDate: NgbDateStruct;
  RecivePaymentsMethods = [{ "key": "Cash", "value": "cash" }, { "key": "PayTm", "value": "paytm" }, { "key": "PhonePe", "value": "phonepe" }]
  paymentRecivedCustomer;
  paymentReciveModalopen(recivePayment, customerObj) {
    console.log("customerObj " + JSON.stringify(customerObj));
    this.paymentRecivedCustomer = customerObj;
    this.modalService.open(recivePayment, { centered: true, size: 'lg' });
  }
  num = 0;
  showDateforPauseCust: Boolean = false;
  pauseDelivery(itemIndex) {
    //console.log(this.showDatePickerTemplate)
    this.showDateforPauseCust = true;
    this.num = 0
  }
  fromDate; fromDateBoolean: Boolean = false; toDate; toDateBoolean: Boolean = false
  onClick() {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    console.log("in click method " + JSON.stringify(this.datePicker));
    this.num++;
    if ((this.num % 2 != 0)) {

      console.log("in if");
      this.frDate = NgbDate.from(this.datePicker);
      this.fromDate = new Date(this.frDate.year, this.frDate.month - 1, this.frDate.day);
      this.fromDate = this.fromDate.getFullYear() + '-' + ('0' + (this.fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.fromDate.getDate() + 1)).slice(-2);
      // console.log("in if"+this.myDate.getDate());
      this.fromDateBoolean = true;
    } else {
      console.log("in else");
      this.tDate = NgbDate.from(this.datePicker);
      this.toDate = new Date(this.tDate.year, this.tDate.month - 1, this.tDate.day);
      this.toDate = this.toDate.getFullYear() + '-' + ('0' + (this.toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.toDate.getDate() + 1)).slice(-2);
      this.toDateBoolean = true;
    }
    console.log("in click method " + this.num + " " + JSON.stringify(this.datePicker));
  }
  phObj = {
    "hackerId": 0, "customerId": 0, "productId": 0, "customerProductId": 0, "productHoldStartDate": "",
    "productHoldEndDate": "", "holdProductAmount": 0, "isActive": 1
  };
  closeproductHoldCaldr: boolean = true;
  productPauseThing(item) {
    // alert("in method")
    debugger;
    item = item.customerRelatedObj
    var phObj = {};
    phObj["hackerId"] = item.hackerId;
    phObj["customerId"] = item.customerId;
    phObj["productId"] = item.productId;
    phObj["customerProductId"] = item.id;
    phObj["productHoldStartDate"] = this.fromDate;
    phObj["productHoldEndDate"] = this.toDate;
    phObj["holdProductAmount"] = 0;
    phObj["isActive"] = 0
    let posturl = "http://localhost:8080/spring-crm-rest/pH/newph";
    this.restService.putCallWithObserable(posturl, (phObj)).subscribe((data) => {
      console.log("in put url" + data);
      this.showCustomerProductDetails(item.customerId)
      this.closeproductHoldCaldr = false;
    });
  }
  customersData = [];
  elimit: number = 8; slimit: number = 0;
  //
  newobj = {
    "id": "",
    "productType": "",
    "aCharges": "0",
    "ProductStartDate": ""
  };

  productType = [{
    "key": "Existing Paper",
    "value": "existingProduct"
  }, {
    "key": "New Paper",
    "value": "newProduct"
  }, {
    "key": "Recursive Paper",
    "value": "recursiveProduct"
  }]

  //product related things starts 
  weekwise = {
    "productName": "",
    "productPrice": { "mon": "0", "tue": "0", "wednes": "0", "thur": "0", "fri": "0", "sat": "0", "sun": "0" }
  }
  daywise = {
    "productName": "", "productPrice": ""
  }
  addProduct(daywise, weekWise) {
    debugger
    var dbobj = {};
    if (daywise) {
      //alert("in daywise");
      dbobj["hackerId"] = 2;
      dbobj["productName"] = this.daywise.productName;
      dbobj["productPrice"] = (this.daywise.productPrice);
      dbobj["productType"] = "monthlyWise";
    }
    if (weekWise) {
      //alert("in weekwise");
      dbobj["hackerId"] = 2;
      dbobj["productName"] = this.weekwise.productName;
      dbobj["productPrice"] = JSON.stringify(this.weekwise.productPrice);
      dbobj["productType"] = "weekWise";
    }
    let posturl = "http://localhost:8080/spring-crm-rest/Customers/p/newProduct";
    this.restService.postData(posturl, (dbobj)).subscribe(
      (data)=>{
        console.log(data);
      });
  }
  newspapers = [];
  getProducts() {
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var getlines = "http://localhost:8080/spring-crm-rest/Customers/p/" + lid.hacker_id;
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        this.newspapers = data;
        this.addNewsPaper();
      });
  }
  //product related things Ends

  line = { "lineName": "" };
  paperslist = [];
  allLines = [];
  //open modal
  openCustomer: Boolean = false;
  openVerticallyCentered(content) {
    this.openCustomer = true;
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var getlines = "http://localhost:8080/spring-crm-rest/lines/lin/" + lid.hacker_id;
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        this.allLines = data;
      });
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  showCustomer: Boolean = true;
  showProducts: Boolean = false;
  showProductinUi() {
    this.showProducts = true;
    this.showCustomer = false
  }
  //To Know how Sundays in month
  AmountForMonth(details) {
    debugger;
    let date = new Date();
    let noOfDysInMnth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    var sundayCount = 0;
    for (var i = 0; i <= noOfDysInMnth; i++) {
      var date1 = new Date(date.getFullYear(), date.getMonth(), i);
      if (date1.getDay() === 0) {
        sundayCount++;
      }
    }
    var totWthoutSundys = noOfDysInMnth - sundayCount;
    for (var a in details) {
      details[a]["nMonthly"] = totWthoutSundys * parseFloat(details[a].newspaper.value.split(",")[0]) + sundayCount * parseInt(details[a].newspaper.value.split(",")[1]);
    }
    return details;
  }
  getCustomers() {
    //  debugger;
    //this.pagelimit=8;slimit:number =0;
    var lid = JSON.parse(localStorage.getItem("lastname"));
   // let url = "http://localhost:8080/spring-crm-rest/Customers/h/" + this.slimit + "/" + this.elimit;
   let url = "http://localhost:8080/nestpay/Customers/clist/" + this.slimit + "/" + this.elimit;
    this.restService.getCustomers(url).subscribe(
      (data) => {
        debugger;
        this.customersData = [];
        this.customersData = data;
        this.customersData = this.customersData["customers"];
        console.log("this.customersData " + this.customersData);
        for (var a in this.customersData) {
          var totalamount = 0;
          this.customersData[a].details = JSON.parse(this.customersData[a].details);
        }

      })
  }
  next8Objs() {
    this.slimit += 8;
    this.elimit += 8;
    this.getCustomers();
  }
  deleteCustomer(id) {
    alert(id);
    let url = "http://localhost:8080/spring-crm-rest/Customers/d/" + id;
    console.log("url " + url);
    var body = {};
    this.restService.postData(url, body);
    this.getCustomers();
  }
  addNewsPaper() {
    // var lid = JSON.parse(localStorage.getItem("lastname"));
    let newobj = {
      "id": "",
      "productType": "",
      "aCharges": "0",
      "ProductStartDate": "",
      "newsPapers": this.newspapers
    }
    this.showDate = false;

    this.paperslist.push(newobj);
    console.log("this.newarry " + this.paperslist);
  }
  onecustomer: any = [];
  showDate: Boolean = false;
  showDateForNewCustomer(data) {
    console.log("date " + data);
    if (data == "newProduct" || data == "recursiveProduct") {
      this.showDate = true;
    }
    else {
      this.showDate = false;
    }
  }
  customerProducts = [];
  viewOneCustomer(content, item) {
    console.log("one customer " + JSON.stringify(item));
    this.modalService.open(content, { centered: true });
    this.onecustomer = item;
    //alert(JSON.stringify(item));
    this.showCustomerProductDetails(item.id);
  }

  showCustomerProductDetails(id) {
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var selectedCustomer = "http://localhost:8080/spring-crm-rest/customerProduct/selectedCustmrPrdouct/" + id + "/0";
    this.restService.getCustomers(selectedCustomer).subscribe(
      (data) => {
        debugger;
        console.log(data);
        //this.onecustomer = data;
        data = data.map(item => {
          item["isDatePickerShown"] = false;
          item["closeDatePickerOnClickSave"] = true;
          return item;
        })
        this.customerProducts = data;

      });
  }

  createProduct(content) {
    this.modalService.open(content, { centered: true });
  }
  weekWise: Boolean = true;
  dayWise: Boolean = false;
  weekWise1(changeif) {
    //alert(changeif);
    if (changeif == 'weekwise') {
      this.weekWise = true;
      this.dayWise = false;
    } else {
      this.dayWise = true;
      this.weekWise = false;
    }
  }

  // CUSTOMER new things start from here
  customer = {
    "name": "",
    "mobileNumber": "",
    "plotNumber": "",
    "lineId": "",
    "addtionalCharges": "",
    "totalAmount": 0
  }

  //~ Customer
  saveCustomer(customer, paperlist) {
    this.openCustomer = false;
    debugger;
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var dbObj = {}; var newarr = [];
    dbObj["hId"] = (lid.hacker_id);
    dbObj["lineId"] = customer.lineId;
    dbObj["mobileNumber"] = customer.mobileNumber;
    dbObj["password"] = "12345";
    dbObj["totalAmount"] = 0;
    newarr.push({ "name": customer.name }, { "plotNumber": customer.plotNumber })
    dbObj["details"] = JSON.stringify(newarr);
    dbObj["isActive"] = 1;
    dbObj["additionalCharges"] = 0;
    let custProduct = {};
    custProduct["customer"] = dbObj;
    var date = new Date()
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var todaydate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('01');
    var monthlastDate = lastDay.getFullYear() + '-' + ('0' + (lastDay.getMonth() + 1)).slice(-2) + '-' + ('0' + lastDay.getDate()).slice(-2);
    console.log(todaydate);
    console.log("monthlastDate " + monthlastDate);
    for (var i = 0; i < paperlist.length; i++) {
      paperlist[i].id = JSON.stringify(paperlist[i].id);
      if (paperlist[i].productType == "existingProduct") {
        paperlist[i].ProductStartDate = todaydate;
        paperlist[i].ProductEndDate = monthlastDate;
      }
      else {
        // paperlist[i].ProductStartDate = todaydate;
        var frDate = (paperlist[i].ProductStartDate);
        var fromDate = new Date(frDate.year, frDate.month - 1, frDate.day);
        paperlist[i].ProductStartDate = fromDate.getFullYear() + '-' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (fromDate.getDate() + 1)).slice(-2);
        paperlist[i].ProductEndDate = monthlastDate;
        //paperlist[i].ProductEndDate = frDate
      }
    }
    custProduct["selectedProduct"] = paperlist;
    let posturl = "http://localhost:8080/spring-crm-rest/Customers/save";
    this.restService.postData(posturl, (custProduct)).subscribe(data => {
      console.log("POST Request is successful ");
      this.getCustomers();
    },
      error => {
        console.log("Error", error);
      });
    //this.myFunction();
    //this.getCustomers();

  }
  myFunction() {
    setTimeout(function () { this.getCustomers(); }, 3000);
  }
  customerInactive(content, body, type) {
    console.log(JSON.stringify(body) + " " + type);
    console.log("content " + content);
    if (type == 'Active') {
      let putUrl = "http://localhost:8080/spring-crm-rest/Customers/inActive/" + body.id + "/0";
      this.restService.updateCall(putUrl, {})
    }
    else {
      let putUrl = "http://localhost:8080/spring-crm-rest/Customers/inActive/" + body.id + "/1";
      this.restService.updateCall(putUrl, {});
    }
    this.modalService.open(content, { centered: true });
  }
  displayMonths;
  navigation;
  showWeekNumbers;
  outsideDays;
  pausedate;
  pauseDeliveryDatePicker() {
    var date = new Date();
    this.displayMonths = 1;
    this.navigation = "none";
    this.showWeekNumbers = false;
    this.outsideDays = 'visible';
  }
  EndDate;
  recivePaymentCreate(obj) {
    debugger;
    console.log("obj" + obj);
  }
  ngOnInit() {
    this.pauseDeliveryDatePicker();
    var lid = JSON.parse(localStorage.getItem("lastname"));
    //this.paperslist.push(this.newobj);
    this.getCustomers();
    this.getProducts();
  }

}
