import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../rest-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbCalendar, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-a-customer',
  templateUrl: './a-customer.component.html',
  styleUrls: ['./a-customer.component.css']
})
export class ACustomerComponent implements OnInit {

  constructor(private restService: RestServiceService,
    private router: ActivatedRoute,
    private modalService: NgbModal
    , calendar: NgbCalendar,
    private toaster: ToastrService) { }
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
  AccountTab: Boolean = true;
  commentTab: Boolean = false;
  historyTab: Boolean = false;
  keepingTabActive;
  statementHistroy = [];
  comment: String = "";
  allComments = [];
  customerpaidStatus;
  statementOFpaidcustomer;

  //Methods

  customer() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/nestpay/Customers/" + cutomerId).subscribe(
      (data) => {
        debugger;
        data["details"] = JSON.parse(data["details"]);
        this.aCustomer = data;
        this.customerpaidStatus = data["customerPaid"];
        if (this.customerpaidStatus == '1') {
          this.paidProductsOfCustomer();
          this.statementofCustomer();
        } else {
          this.productsOfCustomer();
        }
        console.log("datat" + this.aCustomer);
      })
  }
  paidProductsOfCustomer() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    var date = new Date();
    this.restService.getCallwithOut("http://localhost:8080/nestpay/customerProducts/"+ cutomerId + "/" 
    + this.monthsInYear[date.getMonth()-1] + "/" + date.getFullYear()).subscribe(
      (data) => {
        // debugger
        this.customerProductss = data;
        this.prepareProductsArray(data);
        console.log("customerProduct " + JSON.stringify(data));
      })
  }
  statementofCustomer() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    var date = new Date();
    //http://localhost:8080/nestpay/account/statment/210/2020/march
    this.restService.getCallwithOut("http://localhost:8080/nestpay/account/statment/" + cutomerId + "/" + date.getFullYear() + "/" + this.monthsInYear[date.getMonth()-1]).subscribe(
      (data) => {
       debugger
        this.statementOFpaidcustomer = data;
        console.log("statemtn " + JSON.stringify(data));
      })
  }
  productsOfCustomer() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/nestpay/customerProducts/product/" + cutomerId + "/0").subscribe(
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
    var products = this.customerProductss;
    var dbarray = [];

    //var productid = '', customerproudctId = '';
    for (var i = 0; i < products.length; i++) {
      var dbobj = {};
      dbobj["hackerId"] = 0;
      dbobj["customerId"] = custmer.id;
      dbobj["paymentType"] = this.paymentMethodType;
      dbobj["amount"] = custmer.totalAmount;
      dbobj["paymentDate"] = this.todayDate;
      dbobj["isActive"] = 1;
      dbobj['productId'] = products[i]['productId'];
      dbobj['customerProductId'] = products[i]['id'];
      dbobj["month"] = products[i]['pMonth'];
      dbobj["year"] = products[i]['year'];
      dbarray.push(dbobj);
    }
    this.restService.postData("http://localhost:8080/nestpay/account/newaccount", dbarray).subscribe(
      (data) => {
        console.log("data" + data);
        this.customer();
        //this.showPayments(data)
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
    debugger;
    var date = new Date();
    var currentMonth = this.monthsInYear[date.getMonth()]
    this.onlyCustomerProducts = arr.map(
      (item) => {
        if (item.pMonth == (this.monthsInYear[date.getMonth()] || this.monthsInYear[date.getMonth()-1])) {
          var months = {};
          months['product'] = item.productName;
          months['id'] = item.id;
          months['productHoldStatus'] = item.holdIsActive;
          months["showDatePicker"] = false;
          months["closeDatePickerOnClickSave"] = true;
          months["hackerId"] = item.hackerId;
          months["customerId"] = item.customerId;
          months["productId"] = item.productId;
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
        phObj["productHoldStartDate"] = this.fromDate1;
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
    this.restService.getCallwithOut("http://localhost:8080/nestpay/account/statements/" + cutomerId).subscribe(
      (data) => {
        this.statementHistroy = data;
      })
  }

  sendComment(comment) {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    console.log("comment " + comment);
    var dbobj = {};
    dbobj["hackerId"] = 0,
      dbobj["customerId"] = cutomerId;
    dbobj["messageFrom"] = "HackerPortal";
    dbobj["comment"] = comment;
    this.restService.postData("http://localhost:8080/nestpay/comments/newComment", dbobj).subscribe(
      (data) => {
        console.log("data" + data);
        //this.comment='';
        this.toaster.success("commented succesfully", "Success");
        this.viewAllComments();
      }
    )
  }
  viewAllComments() {
    var cutomerId = parseInt(this.router.snapshot.paramMap.get('id'));
    this.restService.getCallwithOut("http://localhost:8080/nestpay/comments/commentList/" + cutomerId).subscribe(
      (data) => {
        this.allComments = data;
        //console.log("datat " + JOSN.stringify(this.allComments));
      })
  }
  pushcode() {
    console.log();
  }
  ngOnInit() {
    this.customer();
   // this.productsOfCustomer();
    // this.statemtnHistory();
    //this.viewAllComments();
  }

}
