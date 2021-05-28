import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable()
export class ApiHttpClient {
  private readonly api = (path: string) =>
    [environment.restEndPoint, path].join('/');

  constructor(private http: HttpClient) { }

  public get<T>(endPoint: string): Observable<T> {
    return this.http.get<T>(this.api(endPoint));
  }

  public post<T>(
    endPoint: string,
    params: Object,
  ): Observable<T> {
    return this.http.post<T>(this.api(endPoint), params);
  }

  public put<T>(
    endPoint: string,
    params: Object,
  ): Observable<T> {
    return this.http.put<T>(this.api(endPoint), params);
  }

  public delete<T>(endPoint: string): Observable<T> {
    return this.http.delete<T>(this.api(endPoint));
  }
}