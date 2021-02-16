import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/_models';
import { Feedback } from '@app/_models/feedback';
import { Projet } from '@app/_models/projet';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';


const users: User[] = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

const projets: Projet[] = [{ id: 1, libelle: 'test', description: 'description 1' }, { id: 2, libelle: 'libelle 2 ', description: 'description 2' }, { id: 3, libelle: 'libelle 3', description: 'description 3' }];
const feedbacks: Feedback[] = [{ id: 1, note: 10, commentaire: 'commentaire 1', userId: 1, projetId: 1 }, { id: 2, note: 20, commentaire: 'commentaire 2', userId: 1, projetId: 2 }];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/projets') && method === 'GET':
                    return getProjets();
                case url.endsWith('/feedbacks') && method === 'GET':
                    return getfeedbacks();
                case url.endsWith('/feedbacks/1') && method === 'GET':
                    return getfeedbacksByProjetId(1);
                case url.endsWith('/feedbacks/2') && method === 'GET':
                    return getfeedbacksByProjetId(2);
                case url.endsWith('/feedbacks/3') && method === 'GET':
                    return getfeedbacksByProjetId(3);
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }
        function getProjets() {
            if (!isLoggedIn()) return unauthorized();
            return ok(projets);
        }

        function getfeedbacks() {
            if (!isLoggedIn()) return unauthorized();
            return ok(feedbacks);
        }

        function getfeedbacksByProjetId(projetId: number) {
            if (!isLoggedIn()) return unauthorized();
            return ok(feedbacks.filter(feed => feed.projetId == projetId));
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};