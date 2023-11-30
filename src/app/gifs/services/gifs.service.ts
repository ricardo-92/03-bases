import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private apikey: string = '77gziPN2WoIm6lwdev7jT49eniYewp7N';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Servise Ready');
   }

  get tagsHistory() {
    return [...this._tagHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if ( this._tagHistory.includes(tag) ) {
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag !== tag )
    }

    this._tagHistory.unshift( tag );
    this._tagHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify( this._tagHistory ));
  }

  private loadLocalStorage():void {
    if( !localStorage.getItem('history')) return;

    this._tagHistory = JSON.parse( localStorage.getItem('history')! );

    if (this._tagHistory.length === 0 ) return;
    this.searchTag( this._tagHistory[0] );
  }

  searchTag( tag: string ):void {
    if ( tag.length === 0 ) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apikey)
    .set('limit', '10')
    .set('q', tag)

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe(  resp => {

        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });
      } )

  // fetch('https://api.giphy.com/v1/gifs/search?api_key=77gziPN2WoIm6lwdev7jT49eniYewp7N&q=valorant&limit=10')
  //   .then( resp => resp.json() )
  //   .then( data => console.log(data) );
  }
}
