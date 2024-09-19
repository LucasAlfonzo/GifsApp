import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'V5JM61Oa8RmqT3t62eDKjbz0csuV1KGF';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _tagsHistory : string[] = [];
  private apiKey : string = GIPHY_API_KEY;
  private serviceUrl : string = 'https://api.giphy.com/v1/gifs';
  public gifList : Gif[] = [];
  constructor(
    private http: HttpClient
  ) {
    this.getLocalStorage();
    this.loadFirstGif();
  }

  get tagsHistory() : string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory( tag : string ) : void{
    tag = tag.toLowerCase();

    if( this._tagsHistory.includes(tag) ){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage() : void{
    localStorage.setItem( 'history' , JSON.stringify(this._tagsHistory) );
  }

  private getLocalStorage() : void {
    const history = localStorage.getItem( 'history' );
    if( !history ) return
    this._tagsHistory = JSON.parse(history);
  }

  private loadFirstGif() : void {
    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }

  searchTag( tag : string ) : void {
    if( tag.length === 0 ) return;
    // this._tagsHistory.unshift( tag );
    this.organizeHistory( tag );

    const params = new HttpParams()
    .set('api_key',this.apiKey)
    .set('q',tag)
    .set('limit','10')
    this.http.get<SearchResponse>( `${this.serviceUrl}/search` , { params } )
      .subscribe( (resp) => {
        // console.log(resp);
        this.gifList = resp.data;
      }
    )
  }

}
