import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../rest-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbCalendar, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-a-customer',
  templateUrl: './a-customer.component.html',
  styleUrls: ['./a-customer.component.css']
})
export class ACustomerComponent implements OnInit {

  constructor(private restService: RestServiceService,
    private router: ActivatedRoute,
    private modalService: NgbModal
    , calendar: NgbCalendar) { }
  //data Google variable declarations
  aCustomer;
  datePicker
  customerProducts = [];
  customerProductss;
  paymentRecivedCustomer;
  RecivePaymentsMethods = [{ "key": "Cash", "value": "cash" }, { "key": "PayTm", "value": "paytm" }, { "key": "PhonePe", "value": "phonepe" }]
  monthsInYear = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  todayDate;
  justPaidAccounts;
  paymentMethodType = '';
  onlyCustomerProducts = [];
  num = 0;
  frDate: NgbDateStruct;
  tDate: NgbDateStruct;
  toDate1;
  fromDate1;
  AccountTab:Boolean=true;
  commentTab:Boolean=false;
  historyTab:Boolean=false;
  keepingTabActive;
  statementHistroy=[];
  comment;
  allComments=[];

  //Methods
  customer() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/spring-crm-rest/Customers/" + cutomerId).subscribe(
      (data) => {
        data["details"] = JSON.parse(data["details"]);
        this.aCustomer = data;
        console.log("datat" + this.aCustomer);
      })
  }

  productsOfCustomer() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/spring-crm-rest/customerProduct/selectedCustmrPrdouct/" + cutomerId + "/0").subscribe(
      (data) => {
        // debugger
        this.customerProductss = data;
        this.prepareProductsArray(data);
        console.log("customerProduct " + JSON.stringify(data));
      })
  }
  reviePaymentModalOpen(recivePayment) {
    var date = new Date();
    this.todayDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate() + 1)).slice(-2);
    console.log("this.todayDate " + this.todayDate);
    this.modalService.open(recivePayment, { centered: true, size: 'lg' });
    this.paymentRecivedCustomer = this.aCustomer;
  }

  recivePaymentPostCall() {
    debugger;

    var custmer = this.aCustomer;
    var products = this.customerProducts;
    var dbarray = [];

    //var productid = '', customerproudctId = '';
    for (var i = 0; i < products.length; i++) {
      var dbobj = {};
      dbobj["hackerId"] = custmer.hId;
      dbobj["customerId"] = custmer.id;
      dbobj["paymentType"] = this.paymentMethodType;
      dbobj["amount"] = custmer.totalAmount;
      dbobj["paymentDate"] = this.todayDate;
      dbobj["isActive"] = 1;
      dbobj['productId'] = products[i]['customerRelatedObj']['productId'];
      dbobj['customerProductId'] = products[i]['customerRelatedObj']['id'];
      dbobj["savemonth"] = products[i]['customerRelatedObj']['month'];
      dbobj["year"] = products[i]['customerRelatedObj']['year'];
      dbarray.push(dbobj);
    }
    this.restService.postData("http://localhost:8080/spring-crm-rest/account/recivedPayment", dbarray).subscribe(
      (data) => {
        console.log("data" + data);
        this.customer();
        this.showPayments(data)
      }
    )
  }

  showPayments(data) {

    for (var a = 0; a < data.length; a++) {
      debugger;
      this.restService.getCallwithOut("http://localhost:8080/spring-crm-rest/account/custPro/" + data[a]["customerProductId"]).subscribe(
        (data1) => {
          debugger;
          this.justPaidAccounts.push(data1);
          console.log("customerProduct " + JSON.stringify(data));
        })
    }
  }
  prepareProductsArray(arr) {
    var date = new Date();
    var currentMonth = this.monthsInYear[date.getMonth()]
    this.onlyCustomerProducts = arr.map(
      (item) => {
        if (item.customerRelatedObj.month == 'MARCH') {
          var months = {};
          months['product'] = item.customerRelatedObj.productName;
          months['id'] = item.customerRelatedObj.id;
          months['productHoldStatus'] = item.customerRelatedObj.productHoldIsActive;
          months["showDatePicker"] = false;
          months["closeDatePickerOnClickSave"] = true;
          months["hackerId"] = item.customerRelatedObj.hackerId;
          months["customerId"] = item.customerRelatedObj.customerId;
          months["productId"] = item.customerRelatedObj.productId;
          return months
        }
      }

    )
  }

  onClickOfProHoldCalender(item) {
    console.log(item)
    this.num++; 
    console.log(this.num);
    if (this.num == 3) {
      debugger
     



    }
   
    else {
      if ((this.num % 2 != 0)) {
        console.log("in if");
        this.frDate = NgbDate.from(this.datePicker);
        var fromDate = new Date(this.frDate.year, this.frDate.month - 1, this.frDate.day);
         this.fromDate1 = fromDate.getFullYear() + '-' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (fromDate.getDate() + 1)).slice(-2);
        console.log("in if" + this.fromDate1);
      } else {
        console.log("in else");
        this.tDate = NgbDate.from(this.datePicker);
        var toDate = new Date(this.tDate.year, this.tDate.month - 1, this.tDate.day);
         this.toDate1 = toDate.getFullYear() + '-' + ('0' + (toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (toDate.getDate() + 1)).slice(-2);
        console.log("toDate1 " + this.toDate1);
        var phObj = {};
        phObj["hackerId"] = item.hackerId;
        phObj["customerId"] = item.customerId;
        phObj["productId"] = item.productId;
        phObj["customerProductId"] = item.id;
        phObj["productHoldStartDate"] =this.fromDate1;
        phObj["productHoldEndDate"] = this.toDate1;
        phObj["holdProductAmount"] = 0;
        phObj["isActive"] = 0
        let posturl = "http://localhost:8080/spring-crm-rest/pH/newph";
        this.restService.putCallWithObserable(posturl, (phObj)).subscribe((data) => {
          console.log("in put url" + data);
       //   this.showCustomerProductDetails(item.customerId)
         // this.closeproductHoldCaldr = false;
        });
      }
    }
  }
  statemtnHistory() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/spring-crm-rest/account/statements/" + cutomerId).subscribe(
      (data) => {
        this.statementHistroy = data;
      })
  }

  sendComment(comment){
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    console.log("comment " +comment);
    var dbobj={};
    dbobj["hackerId"] = 0,
    dbobj["customerId"] = cutomerId;
    dbobj["msgfrom"] = "HackerPortal";
    dbobj["comment"] = comment;
    this.restService.postData("http://localhost:8080/spring-crm-rest/comment/newcomment", dbobj).subscribe(
      (data) => {
        console.log("data" + data);
        this.viewAllComments();
      }
    )
  }
  viewAllComments() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/spring-crm-rest/comment/commts/" + cutomerId).subscribe(
      (data) => {
          this.allComments = data;
        //console.log("datat " + JOSN.stringify(this.allComments));
      })
  }
  pushcode(){
    
  }
  ngOnInit() {
    this.customer();
    this.productsOfCustomer();
    this.statemtnHistory();
    this.viewAllComments();
  }

}
