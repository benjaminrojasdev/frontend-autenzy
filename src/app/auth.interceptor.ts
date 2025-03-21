import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No meter token en las OPTIONS
  if (req.method === 'OPTIONS') {
    return next(req);
  }

  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(authReq);
    }
  }

  return next(req);
};