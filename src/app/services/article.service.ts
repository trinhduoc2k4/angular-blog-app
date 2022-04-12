import { HttpErrorResponse } from '@angular/common/http';
import { Article, Articles } from './../Models';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  public article!: Article;
  public listArticle!: Articles;
  public offset: number = 0;
  public limit: number = 10;
  public tag: string = '';
  public errorResponse!: HttpErrorResponse;
  constructor() {}
}
