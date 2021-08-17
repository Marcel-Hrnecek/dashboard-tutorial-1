import { Injectable } from '@angular/core';
import { ISearchResultItem, SearchService } from './search.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { filter, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { IWeatherData, WeatherService } from './weather.service';

@Injectable()
export class DashboardService {

  private typescriptSearchResultSubject: Subject<CardContent> = new ReplaySubject(1);
  public typescriptSearchResult$ = this.typescriptSearchResultSubject
    .pipe(
      filter(value => !!value)
    );

  private angular2SearchResultSubject: Subject<CardContent> = new ReplaySubject(1);
  public angular2SearchResult$ = this.angular2SearchResultSubject
    .pipe(
      filter(value => !!value)
    );

  private weatherSearchResultSubject: Subject<CardContent> = new ReplaySubject(1);
  public weatherSearchResult$ = this.weatherSearchResultSubject
    .pipe(
      filter(value => !!value)
    );

  constructor(
    private searchService: SearchService,
    private weatherService: WeatherService
  ) {
  }

  public updateQuestions(): void {
    this.getStackoverflowQuestions('TypeScript', 10)
      .subscribe((cardContent: CardContent) => {
        this.typescriptSearchResultSubject.next(cardContent);
      });

    this.getStackoverflowQuestions('Angular2', 10)
      .subscribe((cardContent: CardContent) => {
        this.angular2SearchResultSubject.next(cardContent);
      });

    this.getStackoverflowQuestions('Weather', 5)
      .pipe(
        switchMap((cardContent: CardContent) => this.scrambleWithWeatherData(cardContent))
      )
      .subscribe((cardContent: CardContent) => {
        this.weatherSearchResultSubject.next(cardContent);
      });
  }

  private getStackoverflowQuestions(keyword: string, count: number): Observable<CardContent> {
    return this.searchService.search(keyword, count)
      .pipe(
        map((searchResultItems: ISearchResultItem[]) => {
          if (searchResultItems) {
            const listItems = searchResultItems.map((stackoverflowItem: ISearchResultItem) => {
              return {
                text: stackoverflowItem.title
              };
            });
            return {
              listItems: listItems
            };
          } else {
            return {
              listItems: []
            };
          }
        })
      );
  }

  private scrambleWithWeatherData(cardContent: CardContent): Observable<CardContent> {
    return this.weatherService.getData()
      .pipe(
        map((weatherData: IWeatherData[]) => {
          const randomWeatherData: CardListItem[] = [];
          for (let i = 0; i < cardContent.listItems.length; i++) {
            const randomIndex = Math.round(Math.random() * weatherData.length);
            const weatherDatum = weatherData[randomIndex];
            randomWeatherData.push({
              text: `Temp. A. is ${weatherDatum['Temp. A.']}°C on ${weatherDatum.Datum}`
            });
          }
          return randomWeatherData;
        }),
        map((randomWeatherData: CardListItem[]) => {
          const scrambledListItems = cardContent.listItems
            .reduce((resultList, currentItem, currentIndex) => {
              resultList.push(currentItem);
              resultList.push(randomWeatherData[currentIndex]);
              return resultList;
            }, []);
          return {
            listItems: scrambledListItems
          };
        })
      );
  }
}
