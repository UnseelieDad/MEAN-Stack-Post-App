import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


export class ErrorInterceptor implements HttpInterceptor {
   
    // Intercept an http request and add an authorization header
    // with the current stored jwt token
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // add an error operator to the response stream
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                alert(error.error.message);
                return throwError(error);
            })
        );
    }
}