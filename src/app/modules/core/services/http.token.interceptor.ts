import { Injectable, Injector } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent
} from '@angular/common/http';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { AppConstants } from 'src/app/constants/AppConstants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  intercept(request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    const authService = this.injector.get(AuthenticationService);
    return next.handle(this.addTokenToRequest(request, authService.getAuthToken()))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 401:
                authService.logout();
                return throwError(err);
              /*if (err.error && (err.error === 'invalid_grant' || this.isRefreshTokenExpired(err))) {
                authService.logout();
                return throwError(err);
              }
              return this.handle401Error(request, next);*/
              case 400:
                return throwError(err);
              case 404:
                return throwError(err);
              case 500:
                return throwError(err);
              case 0:
                return throwError(err);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        }));
  }

  isRefreshTokenExpired(err1) {
    const err = err1.error;
    if (err && err.error === 'invalid_token' && err.error_description && err.error_description.indexOf('Invalid refresh token') > -1) {
      return true;
    }
    return false;
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (request.url.indexOf(AppConstants.ACCOUNT_LOGIN) === -1) {
      //return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return request.clone({
        setHeaders:
        {
          _TOKEN: token,
          Authorization: `Bearer ${token}`,
          //'Access-Control-Allow-Origin': '*'
        }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
      const authService = this.injector.get(AuthenticationService);
      return authService.refreshToken()
        .pipe(
          switchMap((user: any) => {
            if (user) {
              this.tokenSubject.next(user.access_token);
              return next.handle(this.addTokenToRequest(request, user.access_token));
            } else {
              return <any>authService.logout();
            }
          }),
          catchError(err => {
            if (err.url.indexOf(AppConstants.ACCOUNT_LOGIN) > -1 && !this.isRefreshTokenExpired(err)) {
              return <any>authService.logout();
            } else {
              return throwError(err);
            }
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }
}
