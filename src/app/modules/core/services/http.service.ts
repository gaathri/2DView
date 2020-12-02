import { LoggerService } from './logger.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  get<T>(path: string, headers?: Object | null): Observable<T> {
    this.logger.log('Request GET API: ', path);
    if (headers) {
      return this.http.get<T>(path, headers);
    } else {
      return this.http.get<T>(path);
    }
  }

  post<T>(path: string, body: string, headers?: Object | null): Observable<T> {
    if (headers) {
      this.logger.log('Request POST API:', path + '\n body: ' + body + '\n headers: ' + JSON.stringify(headers));
      return this.http.post<T>(path, body, headers);
    } else {
      this.logger.log('Request POST API: ', path + '\n body: ' + body);
      return this.http.post<T>(path, body);
    }
  }

  put<T>(path: string, body: string): Observable<T> {
    this.logger.log('Request PUT API: ', path + '\n body: ' + body);
    return this.http.put<T>(path, body);
  }

  delete<T>(path: string): Observable<T> {
    this.logger.log('Request DELETE API :', path);
    return this.http.delete<T>(path);
  }

  patch<T>(path: string, body: string): Observable<T> {
    this.logger.log('Request PATCH API :', path + '\n body: ' + body);
    return this.http.patch<T>(path, body);
  }
}
