import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestServiceService } from '../rest-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private restService: RestServiceService, private modalService: NgbModal) { }
  hackerIdFromLsage: number;
  listofLines;
  isLinesCollapsed = true;
  isProductCollapsed = true;
  line = { "lineName": "" };
  showCustomer(lineNo) {
    alert(JSON.stringify(lineNo));
  }
  listOfLines(hackerIdFromLsage) {
    var url = "http://localhost:8080/spring-crm-rest/lines/lin/" + hackerIdFromLsage;
    this.restService.getCustomers(url)
      .subscribe((data) => {
        this.listofLines = data;
        console.log("listOfLines" + this.listofLines);
      })
  }
  lineType: String;
  linebuttonType: String = "Add";
  clickedLineId: number;
  openModal(content, lineTyp, lineDet) {
    console.log(" line " + JSON.stringify(lineDet));
    this.line.lineName = lineDet.lineName;
    if (lineTyp == 'addLine') { this.lineType = "Create"; this.linebuttonType = "Add"; }
    else { this.lineType = "Edit"; this.linebuttonType = "Update"; this.clickedLineId = lineDet.lineId }
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  addLine(line, buttontype) {
    //alert("line"+JSON.stringify(line));
    console.log(JSON.stringify(line) + " " + buttontype);
    line["hackerId"] = this.hackerIdFromLsage;
    console.log("line" + JSON.stringify(line));
    if (buttontype == "Add") {
      var url = "http://localhost:8080/spring-crm-rest/lines/save";
      this.restService.postData(url, (line));
    }
    else {
      line["lineId"] = this.clickedLineId;
      console.log(JSON.stringify(line));
      var url = "http://localhost:8080/spring-crm-rest/lines/update";
      this.restService.updateCall(url, line);
    }
  }
  newspapers;
  getProducts() {
    var lid = JSON.parse(localStorage.getItem("lastname"));
    var getlines = "http://localhost:8080/spring-crm-rest/Customers/p/" + lid.hacker_id;
    this.restService.getCustomers(getlines).subscribe(
      (data) => {
        this.newspapers = data;
      });
  }
  ngOnInit() {
    this.hackerIdFromLsage = JSON.parse(localStorage.getItem("lastname")).hacker_id;
    // this.listOfLines(this.hackerIdFromLsage);
    //this.getProducts();
  }

}
