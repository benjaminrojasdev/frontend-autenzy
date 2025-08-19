import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
})
.then(() => {
  const fallback = document.getElementById('fallback-content');
  if (fallback) {
    fallback.style.display = 'none';
  }
})
.catch((err) => console.error(err));