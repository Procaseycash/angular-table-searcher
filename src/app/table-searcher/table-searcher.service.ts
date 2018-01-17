import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/from';
import {HttpClient} from "@angular/common/http";
@Injectable()
export class TableSearcherService {
  private searched: Array<Object> = [];

  constructor(private http: HttpClient) {
  }

  /**
   * This is used to initialize searching of data from the object passed.
   * @param {Array<Object>} values
   * @param toFind
   * @param {Array<string>} keys
   * @returns {Array<Object>}
   */
  public initSearch(values: Array<Object>, toFind: string = '', keys?: Array<string>): Observable<any> {
    this.searched = [];
    if (keys && keys.length > 0) {
      keys.forEach((key) => {
          this.startSearching(values, toFind, key);
      });
    } else {
      this.startSearching(values, toFind);
    }
    // console.log('searched=', this.searched);
    const result = new ReplaySubject();
    result.next(this.searched);
    return Observable.from(result);
    // return this.searched;
  }

  /**
   * This is used to start the search after initialization has taken place.
   * @param {Array<Object>} values
   * @param toFind
   * @param {string} key
   */
  private startSearching(values: Array<Object>, toFind: string, key?: string) {
    // console.log('values=', values);
    values.filter((value) => {
      const status = (key) ? this.processObject(value, toFind, key) : this.processObject(value, toFind);
      if (status && this.searched.indexOf(value) === -1) {
          this.searched.push(value);
        // console.log('Finalsaerched=', status, this.searched);
      }
      return status;
    });
    // console.log('ReturnFinalsaerched=', this.searched);
  }

  /**
   * This is used to start an object search for the input values toFind.
   * @param {Object} values
   * @param {string} toFind
   * @param {string} key
   * @returns {boolean}
   */
  private processObject(values: Object, toFind: string, key?: string): boolean {
    let status = null;
    for (const valKey in values) {
      if (status) {
        // console.log('this is true');
        break;
      } else {
        const value = values[valKey];
        if (!value) {
          continue;
        }

        // console.log('key=', valKey, value);
        switch (value.constructor) {
          case Array:
            status = (key) ? this.processArray(value, toFind, [key, valKey]) : this.processArray(value, toFind);
            // console.log('status1=', status);
            break;
          case Object:
            const innerKeys = Object.keys(value);
            if (key && innerKeys.indexOf(key) === -1) {
              status = false;
              continue ;
            }
            status = (key) ? this.processObject(value, toFind, key) : this.processObject(value, toFind);
            // console.log('status2=', status);
            break;
          case String:
            status = (key) ? this.processValidation(value, toFind, [key, valKey]) : this.processValidation(value, toFind);
            // console.log('status=', status);
            break;
          default:
            status = false;
            break;
        }
      }
    }
    return !!(status);
  }

  /**
   * This is used to filter depth object having multiple level objects or arrays
   * @param {Array<any>} values
   * @param {string} toFind
   * @param {Array<string>} keys
   * @returns {boolean}
   */
  private processArray(values: Array<any>, toFind: string, keys?: Array<string>) {
    values.filter((value) => {
      if (!value) {
        return false;
      }
      switch (value.constructor) {
        case Array:
          return !!((keys[0]) ? this.processArray(value, toFind, keys) : this.processArray(value, toFind));
        case Object:
          const innerKeys = Object.keys(value);
          if (keys[0] && innerKeys.indexOf(keys[0]) === -1) {
            return false;
          }
          return (keys[0]) ? this.processObject(value, toFind, keys[0]) : this.processObject(value, toFind);
        case String:
          return (keys[0]) ? this.processValidation(value, toFind, keys) : this.processValidation(value, toFind);
        default:
          return false;
      }
    });
    return (values && values.length > 0);
  }

  /**
   * This is used to compare if data lookup is valid or not
   * @param {string} value
   * @param {string} toFind
   * @param {Array<string>} keys
   * @returns {boolean}
   */
  private processValidation(value: string, toFind: string, keys?: Array<string>): boolean {
    value = String(value.toLowerCase().trim());
    toFind = String(toFind.toLowerCase().trim());
    // console.log('toFind=', toFind, 'Value=', value, keys.toString(), (keys[0] === keys[1] && value.indexOf(toFind) > -1));
    return (keys) ? (keys[0] === keys[1] && value.indexOf(toFind) > -1) : (value.indexOf(toFind) > -1);
  }

  /**
   * This is used to search backend if empty list is encountered.
   * @returns {Observable<any>}
   */
  searchResource(url): Observable<any> {
    return this.http.get(url);
  }

}
