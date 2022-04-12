import { Article, Articles, Comment, Profile, User } from './../Models';
import { AddComment, UpdateArticle } from './../RequestModels';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  CreateArticle,
  LoginUserBody,
  RegisterUserBody,
  UpdateUser,
} from '../RequestModels';
import { AuthService } from './auth.service';
import { ArticleService } from './article.service';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  public TOKEN: string = '';
  public BASE_API: string = 'https://conduit.productionready.io/api';
  // public BASE_API: string = 'http://127.0.0.1:27017';
  public options = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    }),
  };

  private httpIgnore!: HttpClient;

  constructor(
    public http: HttpClient,
    public auth: AuthService,
    private handler: HttpBackend,
    public article: ArticleService
  ) {
    this.httpIgnore = new HttpClient(this.handler);
  }

  // User
  public loginUser(body: LoginUserBody) {
    const url: string = `${this.BASE_API}/users/login`;
    return this.http
      .post<{ user: User }>(url, body, this.options)
      .pipe(catchError(this.handleError));
  }

  public registerUser(body: RegisterUserBody) {
    const url: string = `${this.BASE_API}/users`;
    return this.http
      .post<{ user: User }>(url, body, this.options)
      .pipe(catchError(this.handleError));
  }

  public updateUser(body: UpdateUser) {
    const url: string = `${this.BASE_API}/user`;
    return this.http
      .put<{ user: User }>(url, body, this.options)
  }
  public getUser() {
    const url: string = `${this.BASE_API}/user`;
    return this.http
      .get<{ user: User }>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  //Profile
  public getProfile(username: string) {
    const url: string = `${this.BASE_API}/profiles/${username}`;
    return this.http
      .get<{ profile: Profile }>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  public followUser(username: string) {
    const url: string = `${this.BASE_API}/profiles/${username}/follow`;
    return this.http
      .post<{ profile: Profile }>(url, {}, this.options)
      .pipe(catchError(this.handleError));
  }

  public unfollowUser(username: string) {
    const url: string = `${this.BASE_API}/profiles/${username}/follow`;
    return this.http
      .delete<{ profile: Profile }>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  // Articles
  public getListArticles(params: {
    limit?: number;
    offset?: number;
    tag?: string;
    author?: string;
    favorited?: string;
  }) {
    let url: string = `${this.BASE_API}/articles?limit=${
      params.limit ? params.limit : 10
    }&offset=${params.offset ? params.offset : 0}`;

    if (params.tag) url += `&tag=${params.tag}`;
    if (params.author) url += `&author=${params.author}`;
    if (params.favorited) url += `&favorited=${params.favorited}`;
    return this.http
      .get<Articles>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  public getFeedArticles() {
    const url: string = `${this.BASE_API}/articles/feed`;
    return this.http
      .get<Articles>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  public getArticlesWithSlug(slug: string) {
    const url: string = `${this.BASE_API}/articles/${slug}`;
    return this.http
      .get<{ article: Article }>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  public createArticle(body: CreateArticle) {
    const url: string = `${this.BASE_API}/articles`;
    return this.http
      .post<{ article: Article }>(url, body, this.options)
  }
  public updateArticle(slug: string, body: UpdateArticle) {
    const url: string = `${this.BASE_API}/articles/${slug}`;
    return this.http
      .put<{ article: Article }>(url, body, this.options)
      
  }

  public deleteArticle(slug: string) {
    const url: string = `${this.BASE_API}/articles/${slug}`;
    return this.deleteData(url);
  }

  // Comments from Article
  public addCommentsToArticle(slug: string, body: AddComment) {
    const url: string = `${this.BASE_API}/articles/${slug}/comments`;
    return this.http
      .post<Comment>(url, body, this.options)
      .pipe(catchError(this.handleError));
  }

  public getCommentsFromArticle(slug: string) {
    const url: string = `${this.BASE_API}/articles/${slug}/comments`;
    return this.http
      .get<{ comments: Comment[] }>(url, this.options)
      .pipe(catchError(this.handleError));
  }

  public deleteComment(slug: string, id: string | number) {
    const url: string = `${this.BASE_API}/articles/${slug}/comments/${id}`;
    return this.deleteData(url);
  }

  public favoriteArticle(slug: string) {
    const url: string = `${this.BASE_API}/articles/${slug}/favorite`;
    return this.http
      .post<{ article: Article }>(url, {}, this.options)
      .pipe(catchError(this.handleError));
  }

  public unfavoriteArticle(slug: string) {
    const url: string = `${this.BASE_API}/articles/${slug}/favorite`;
    return this.deleteData(url);
  }

  // Tags
  public getTags() {
    const url: string = `${this.BASE_API}/tags`;
    return this.http
      .get<{ tags: string[] }>(url)
      .pipe(catchError(this.handleError));
  }

  // DELETE
  public deleteData(url: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: `Token ${this.auth.getToken()}`,
      }),
    };
    return this.httpIgnore
      .delete(url, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      this.auth.errorResponse = error;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // if (error.status === 422) {
      //   this.article.errorResponse = error;
      // }
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => error.error);
  }
}
