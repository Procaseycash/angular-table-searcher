import {Component, Input, OnInit} from '@angular/core';
import {TableSearcherService} from './table-searcher.service';
import {TableSearcherTypesEnum} from './table-seacher-types.enum';
import {EventsService} from './event.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {TableSearcherInterface} from "./table-searcher.interface";

@Component({
  selector: 'app-table-searcher',
  templateUrl: './table-searcher.component.html',
  styleUrls: ['./table-searcher.component.css'],
})
export class TableSearcherComponent implements OnInit {

  private static defaultAllSettings: TableSearcherInterface<Object> = {
    path: null,
    placeholder: 'What are you looking for?',
    data: [],
    searchKeys: [],
    from: null,
    queryField: 'search',
    borderColor: '#eee000',
    buttonColor: '#83e6bc',
    searchType: TableSearcherTypesEnum.EMPTY_TABLE_APPLY_BACKEND
  };

  @Input() allSettings: TableSearcherInterface<Object> = {
    path: null,
    placeholder: 'What are you looking for?',
    data: [],
    searchKeys: [],
    from: null,
    queryField: 'search',
    borderColor: '#eee000',
    buttonColor: '#83e6bc',
    searchType: TableSearcherTypesEnum.EMPTY_TABLE_APPLY_BACKEND
  };

  public searching = false;
  private copyData = [];


  constructor(private tableSearcherService: TableSearcherService,
              private eventsService: EventsService) {
  }

  /**
   * This is used to set the border color for the div
   * @returns {{border-bottom: string}}
   */
  public setBorderColor() {
    return {'border-bottom': '3px solid ' + this.allSettings.borderColor};
  }

  /**
   * This is used to style the button background
   * @returns {{background: string}}
   */
  public setButtonColor() {
    return {'background': this.allSettings.buttonColor};
  }

  /**
   * This is used to initialize searching on a table.
   * @param query
   */
  doSearch(query) {
    if (!query) {
      return null;
    }
    this.searching = true;
    setTimeout(() => {
      switch (this.allSettings.searchType) {
        case TableSearcherTypesEnum.EMPTY_TABLE_APPLY_BACKEND:
          this.processSearching(TableSearcherTypesEnum.EMPTY_TABLE_APPLY_BACKEND, query);
          break;
        case TableSearcherTypesEnum.ON_BACKEND:
          this.doSearchBackend(query);
          break;
        case TableSearcherTypesEnum.ON_TABLE:
          this.processSearching(TableSearcherTypesEnum.ON_TABLE, query);
          break;
        default:
          Observable.throw('Unknown search type');
          break;
      }
    }, 200);
  }

  /**
   * This is used to search query strings
   * @param type
   * @param query
   */
  private processSearching(type, query) {
    this.tableSearcherService.initSearch(this.allSettings.data, query, this.allSettings.searchKeys)
      .subscribe(
        (result) => {
          // console.log('saerchResult=', result);
          if (result.length === 0 && type === TableSearcherTypesEnum.EMPTY_TABLE_APPLY_BACKEND) {
            this.doSearchBackend(query);
            return;
          }
          this.eventsService.broadcast(this.allSettings.from, {result: result, data: this.copyData});
          this.searching = false;
          // console.log('searching=', this.searching);
        },
        (err) => {
          this.searching = false;
          Observable.throw(err);
        }
      );
  }

  /**
   * This is used to make a request to a backend api for searching.
   * @param query
   */
  private doSearchBackend(query) {
    const pos = this.allSettings.path.indexOf('?');
    this.allSettings.path = (pos > -1) ? this.allSettings.path + `&${this.allSettings.queryField}=${query}` : this.allSettings.path + `?${this.allSettings.queryField}=${query}`;
    this.tableSearcherService.searchResource(this.allSettings.path)
      .map((res) => res.json())
      .subscribe(
        (res) => {
          this.eventsService.broadcast(this.allSettings.from, {result: res, data: this.copyData});
          this.searching = false;
        },
        (err) => {
          this.searching = false;
          Observable.throw(err);
        }
      );
  }

  /**
   * This is used to validate object passed down to table searcher.
   * @constructor
   */
  ValidateSettings() {
    for (const key in this.allSettings) {
      if (!this.allSettings[key]) {
        this.allSettings[key] = TableSearcherComponent.defaultAllSettings[key];
      }
    }
  }

  ngOnInit() {
    this.ValidateSettings();
    this.copyData = JSON.parse(JSON.stringify(this.allSettings.data));
  }

}



