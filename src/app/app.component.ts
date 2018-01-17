import {Component, OnInit} from '@angular/core';
import {EventsService} from "./table-searcher/event.service";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {TableSearcherTypesEnum} from "./table-searcher/table-seacher-types.enum";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public tableSearcher = {
    path: 'http://localhost:8088/api/organizations',
    searchType: TableSearcherTypesEnum.ON_TABLE,
    searchKeys: [],
    borderColor: 'red',
    buttonColor: 'black',
    data: null,
    placeholder: 'Filter information...',
    from: 'search_organizations'
  };

  constructor(private eventsService: EventsService, private http: Http) {
    this.eventsService.on(this.tableSearcher.from, (res) => {
      // Note that table will response from table searcher will respond with result and data,
      // the result is the searched item while data is the previous data passed down to it.
      // the result can be of array or object.
      // if result is an array, that is the final result
      // but if result is object, it denotes a backend response, so you can drill down to pick the searched result depending on your api response.
      console.log('response=', res);
      this.tableSearcher.data = (res['result'].constructor === Array) ? res['result'] : res['result'].data['data']; // update table data in view
    });
  }
  private getOrganizations() {
    this.http.get(this.tableSearcher.path)
      .map( res => res.json()).subscribe(
      (res) => {
        this.tableSearcher.data = res['data']['data'];
      },
      (err) => {

      }
    );
  }

  ngOnInit() {
    this.getOrganizations();
  }
}
