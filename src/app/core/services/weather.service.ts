import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export interface IWeatherData {
  Datum: string;
  Zeit: string;
  'Temp. A.': number;
  'Temp. 3': number;
  'Feuchte A.': number;
  Luftdruck: number;
  Regen: number;
  Wind: number;
  Richtung: number;
  Helligkeit: number;
}

@Injectable()
export class WeatherService {

  constructor(
    private http: Http
  ) {
  }

  getData(): Observable<IWeatherData[]> {
    return this.http.get('assets/data/weatherdata.json')
      .pipe(
        map((res: Response) => {
          return res.json();
        }),
        catchError(err => {
          console.error(err);
          // TODO: Meaningful error handling
          return of([]);
        })
      );
  }

}
