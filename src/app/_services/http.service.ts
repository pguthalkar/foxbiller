import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  _apiURL : string;
  constructor(private http: HttpClient) {
  }


  public postHttpResult(url,data,headers): Observable<any>
  {
    return this.http.post<any>(url,data,{headers});
  }
}
