import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { AuthServiceService } from './auth-service.service';
import { catchError, switchMap, throwError, EMPTY, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);

  if (req.method === 'OPTIONS') {
    return next(req);
  }

  const token = sessionStorage.getItem('token');
 
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 || err.status === 403) {
        sessionStorage.removeItem('token');

        return authService.login().pipe(
          switchMap((res) => {

            if (res?.token) {
              sessionStorage.setItem('token', res.token);
              location.reload();
              return EMPTY;
            } else {
              return throwError(() => err);
            }
          }),
          catchError((loginErr) => {
            location.href = '/';
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
