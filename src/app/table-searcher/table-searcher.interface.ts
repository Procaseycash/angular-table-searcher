import {TableSearcherTypesEnum} from "./table-seacher-types.enum";

export interface TableSearcherInterface<T> {
  path: string;
  placeholder: string;
  data: Array<Object>;
  searchKeys: Array<string>;
  from: string;
  borderColor: string;
  buttonColor: string;
  queryField: string;
  searchType: TableSearcherTypesEnum;
}
