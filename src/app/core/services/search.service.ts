import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export interface ISearchResultItem {
  answer_count: number;
  closed_date: number;
  closed_reason: string;
  creation_date: number;
  is_answered: boolean;
  last_activity_date: number;
  link: string;
  score: number;
  tags: Array<string>;
  title: string;
  view_count: number;
}

@Injectable()
export class SearchService {

  private static readonly apiUrl =
    'https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&intitle=';

  constructor(private http: Http) {
  }

  search(keyword: string, count = 10): Observable<ISearchResultItem[]> {
    return this.http.get(`${SearchService.apiUrl}${keyword}&pagesize=${count}`)
      .pipe(
        map((res: Response) => {
          const data = res.json();
          console.log('API USAGE: ' + data.quota_remaining + ' of ' + data.quota_max + ' requests available');
          return data;
        }),
        map((data: { items: ISearchResultItem[] }) => {
          return data.items;
        }),
        catchError(err => {
          console.error(err);
          // TODO: Meaningful error handling
          return of([]);
        })
      );
  }

}
