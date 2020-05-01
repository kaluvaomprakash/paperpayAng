import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../rest-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error, debug } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  constructor(private modalService: NgbModal, private restService: RestServiceService,
    private toaster: ToastrService, private routers: Router) { }

  //data
  inputValues: any = [];
  customersData = []
  elimit: number = 8; slimit: number = 0;
  allLines;
  newspapers;
  showDate: Boolean = true;
  paperslist = [];
  customer = {
    "name": "",
    "mobileNumber": "",
    "plotNumber": "",
    "lineId": "",
    "addtionalCharges": "",
    "totalAmount": 0
  }
  productType = [{
    "key": "Existing Paper",
    "value": "existingProduct"
  }, {
    "key": "New Paper",
    "value": "newProduct"
  }]
  newobj = {
    "id": "",
    "productType": "",
    "aCharges": "0",
    "ProductStartDate": "",
    "newsPapers": this.newspapers
  }
  weekwise = {
    "productName": "",
    "productPrice": { "mon": 0, "tue": 0, "wednes": 0, "thur": 0, "fri": 0, "sat": 0, "sun": 0 }
  }
  daywise = {
    "productName": "", "productPrice": ""
  }
  weekWise: Boolean = true;
  dayWise: Boolean = false;
  Heading: String = "All";
  onClickOfFilter_1: Boolean = false;
  filtersLabels = [{ "label": "All", "applyColor": false }, { "label": "Paid", "applyColor": false }, { "label": "Due", "applyColor": false }];
  showProductsInModal: boolean = false;
  buttonClickOFshowProudcts: boolean = true;
  showACtextBox: any = [];
  newUiproductObj: any = [];
  emptyArray: any = [];
  //methods
  getCustomers() {
    // debugger;
    //this.pagelimit=8;slimit:number =0;
    var lid = JSON.parse(localStorage.getItem("lastname"));
    let url = "http://localhost:8080/nestpay/Customers/clist/" + this.slimit + "/" + this.elimit;
    this.restService.getCustomers(url).subscribe(
      (data) => {
        // this.customersData = [];
        this.customersData = data;
        //this.customersData = this.customersData["customers"];
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
    debugger;
    let url = "http://localhost:8080/nestpay/Customers/d/" + id;
    console.log("url " + url);
    var body = {};
    this.restService.postData(url, body).subscribe(
      (data) => {
        console.log(data);
        if (data == 1) {
          this.toaster.success("Customer Deleted successfully", "Success");
          this.getCustomers();
        }
        else {
          this.toaster.error("Customer Deleting Failed", "Faied");
        }

      })
    //
  }
  openVerticallyCentered(content) {
    // this.paperslist.push(this.newobj);
    //this.addNewsPaper();
    this.getProducts();
    //this.openCustomer = true;
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var getlines = "http://localhost:8080/nestpay/lines/";
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        debugger
        this.allLines = data;
        //console.log("array" + JSON.stringify(this.newUiproductObj));
      });
    this.modalService.open(content, { centered: true, size: 'sm' });
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
  showDateForNewCustomer(data) {
    console.log("date " + data);
    if (data == "newProduct" || data == "recursiveProduct") {
      this.showDate = true;
    }
    else {
      this.showDate = false;
    }
  }
  saveCustomer(customer, paperlist) {
    //this.openCustomer = false;
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
      delete paperlist[i]["newsPapers"];
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
      this.toaster.success("Customer Added successfully", "Success");
      this.getCustomers();
    },
      error => {
        this.toaster.error("please check your internet", "Failed");
        console.log("Eerror", error);
      });
    //this.myFunction();
    //this.getCustomers();

  }
  getProducts() {
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var getlines = "http://localhost:8080/nestpay/products/listfProducts";
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        this.newspapers = data;
        //this.newspapers = this.newspapers.map(
        // (item) => {
        //   item["show_comment_box"] = false;
        //   return item;
        // }
        // )
        //console.log(JSON.stringify(this.newspapers));
        this.newUiproductObj = this.newspapers.map(
          (data, index) => {
            //console.log(index);
            var obj = {};
            obj['aCharges'] = 0;
            obj['product'] = false;
            return obj;
          }

        )
        console.log(this.newUiproductObj)
        this.addNewsPaper();
      });
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
    let posturl = "http://localhost:8080/nestpay/products/newProduct";
    this.restService.postData(posturl, (dbobj)).subscribe(
      (data) => {
        debugger;
        this.toaster.success("Newspaper  Added successfully", "Success");
        console.log(data);
      },
      error => {
        this.toaster.error("Failed To add Newspaper", "Failed")

      });
  }
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
  createProduct(content) {
    this.modalService.open(content, { centered: true });
  }
  filters(data) {
    this.Heading = data;
    this.routers.navigate([],
      { queryParams: { "test": data } }
    )
    console.log("data " + data);
  }
  testToaster() {
    this.toaster.error("some message", "title");
  }
  productCheck(i) {
    this.showACtextBox[i] = true;
  }
  onClickNextCreateCustomer(customer) {
    debugger;
    console.log("customer " + JSON.stringify(customer));
    var dbObj = {}; var newarr = [];
    //dbObj["hId"] = (lid.hacker_id);
    dbObj["lineId"] = customer.lineId;
    dbObj["mobileNumber"] = customer.mobileNumber;
    dbObj["password"] = "12345";
    dbObj["totalAmount"] = 0;
    dbObj["name"] = customer.name
    newarr.push({ "plotNumber": customer.plotNumber })
    dbObj["details"] = JSON.stringify(newarr);
    dbObj["isActive"] = 1;
    dbObj["additionalCharges"] = 0;
    let posturl = "http://localhost:8080/nestpay/Customers/newCustomer";
    this.restService.postData(posturl, (dbObj)).subscribe(data => {
      console.log("POST Request is successful " + data);
      this.toaster.success("Customer Added successfully", "Success");
      this.new_product(data["id"]);
     
    },
      error => {
        this.toaster.error("please check your internet", "Failed");
        console.log("Eerror", error);
      }); 
  }
  new_product(id) {
    var url = "http://localhost:8080/nestpay/customerProducts/newcustomerProduct";
    var inputValues1x = this.inputValues.map(
      (item)=>{
        return item.customerId = id;
      })
    this.restService.postData(url,this.inputValues).subscribe(
      (data) => {
        console.log(data);
        this.getCustomers();
        this.toaster.success("Product Added successfully", "Success");
      }, error => {
        console.log(error)
        this.toaster.error("something went wrong DUCKED", "Failed");
      })
  }
  heartochageinprdoctui(newUiproductObj, id, event) {
    console.log("hear to change of proudct ui")
    console.log(JSON.stringify(newUiproductObj) + " " + JSON.stringify(event) + " " + JSON.stringify(id));


  }
  show_comment_box(newUiproductObj, obj) {
    debugger
    console.log("in show_comment_box " + JSON.stringify(newUiproductObj) + " " + JSON.stringify(obj));
    newUiproductObj["customerId"] = 0;
    newUiproductObj["productId"] = obj.id;
    newUiproductObj["productName"] = obj.productName;
    newUiproductObj["productType"] = "weekProduct";
    newUiproductObj["aCharges"] = newUiproductObj.aCharges;
    newUiproductObj["isRecursive"] = "existingProduct";
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var todaydate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('01');
    var monthlastDate = lastDay.getFullYear() + '-' + ('0' + (lastDay.getMonth() + 1)).slice(-2) + '-' + ('0' + lastDay.getDate()).slice(-2);
    newUiproductObj["productStartDate"] = todaydate;
    newUiproductObj["productEndDate"] = monthlastDate;
    if (newUiproductObj.product) {
      newUiproductObj.productId = false
      this.inputValues = this.inputValues.filter(
        (item) => {
          return item.productId != obj.id
        })
    }
    else {
      newUiproductObj.product = true
      this.inputValues.push(newUiproductObj);
    }

    console.log("this.inputValues "+JSON.stringify(this.inputValues));
  }
  show_more_details_of_Customer(id){
    console.log(id);
    this.routers.navigateByUrl('customer/'+id);
  }
  edit_customer(content,item){
    console.log("item eidti "+JSON.stringify(item));
    this.openVerticallyCentered(content);
    this.customer.plotNumber = item.details[0].plotNumber;
    this.customer = item;
  }
  ngOnInit() {
    this.getCustomers();
  }

}
