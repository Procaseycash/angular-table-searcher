# AngularTableSearcher (Angular ^5...)

This is an angular table searcher. it helps to use keys provided to search through a list of objects and if no keys are provided, it searches for the occurrence of the input value. it also makes request to endpoint if url is provided for backend search.     

 ## Release Note
 Due to compatibility issues in Angular 4 & 5, we will maintain all:
 ````
 Angular 4 from 4.0.0 and above.
 Angular 5 from 5.0.0 and above.
 ````

 ## Dependencies
 
 `npm install font-awesome --save`
 
 Read up on how to setup font-awesome in your application.
 
 ## Installation
 
 `npm install --save angular-table-searcher`

   
## Usage in Application

Follow the instruction below to use angular-table-searcher.

`import {AngularTableSearcherModule} from 'angular-table-searcher';`

Add `AngularTableSearcherModule.forRoot()` in AppModule or Other Modules using `AngularTableSearcherModule`
     
   # Notice: 
  ```` 
  path: full path of the api url to call for search option.
  from: the key the eventService will use in mapping when data has responded from angular-table-seacher. (from key must be unique to every component using searcher)
  data: (paginated response), this must be the first data rendered from the component which information are picked to enable searching.
  searchKeys: Keys to tell the AngularTableSearcher to use to filter data.
  searchType: We have three search types which can be from backend, table, table not found with backend.
  placeholder: What to display in the input field as a message
  buttonColor: The background color of the table seacher.
  borderColor: The border-bottom color of the table seacher.
  queryField: The field name to pass search value into. such as search will be search='value entered'
  ````
  
  A sample AngularTableSearcher built url for searching will be `http://localhost:8088/api/organizations?search=olanipekun'`
  
  
   ## *.component.ts
   
   Add/refactor the following code to the appropriate places in your component.ts
   
   
  ## searching
      Searching can either be done with enter or button click after value has been supplied.
 
  ## Response
  The response from angular-table-searcher is an object of type:
  ````
  {
  result: Object | Array,
  data: Array // data passed down to table-searcher.
  }
  ````    
  
````
import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {EventsService, TableSearcherTypesEnum} from "angular-table-searcher";
import {TableSearcherInterface} from "./table-searcher/table-searcher.interface";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
   public tableSearcher: TableSearcherInterface<Object> = {
     path: 'http://localhost:8088/api/organizations',
     searchType: TableSearcherTypesEnum.EMPTY_TABLE_APPLY_BACKEND,
     searchKeys: [],
     borderColor: '',
     buttonColor: '',
     queryField: 'search',
     data: null,
     placeholder: 'Filter information...',
     from: 'search_organizations'
   };

  constructor(private eventsService: EventsService, private http: HttpClient) {
    this.eventsService.on(this.tableSearcher.from, (res) => {
      // Note that table will response from table searcher will respond with result and data,
      // the result is the searched item while data is the previous data passed down to it.
      // the result can be of array or object.
      // if result is an array, that is the final result
      // but if result is object, it denotes a backend response, so you can drill down to pick the searched result depending on your api response.
      // console.log('response=', res);
      this.tableSearcher.data = (res['result'].constructor === Array) ? res['result'] : res['result'].data['data']; // update table data in view
    });
  }
  private getOrganizations() {
    this.http.get(this.tableSearcher.path)
      .subscribe(
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


      
  ````
  
  ## *.component.html
  Add this below the table you want it to paginate data from backend.
  
  ````
<div style="width: 30%; margin: 10px auto;" *ngIf="tableSearcher.data">
  <app-table-searcher [allSettings]="tableSearcher"></app-table-searcher>
  <table width="100%" class="table table-striped table-responsive">
    <tr>
      <td>#</td>
      <td>Name</td>
    </tr>

    <tr *ngFor="let page of tableSearcher.data; let i = index;">
      <td>{{(i + 1)}}</td>
      <td>{{page?.name}}</td>
    </tr>

  </table>


</div>
````

## Backend expected request

Your backend will expect 

````
queryField: any type to search information
````
 
## Build as a package

`npm run pack-build`


## Publish to npm

`npm publish dist`
