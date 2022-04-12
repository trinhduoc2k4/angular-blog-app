import { Subscription } from 'rxjs';
import { ArticleService } from './../../../services/article.service';
import { Component, OnInit, DoCheck, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Articles } from 'src/app/Models';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, DoCheck, OnDestroy {
  public offset: number = 0;
  public limit: number = 10;
  public listPage: Array<number> = [];
  public Subscription = new Subscription();
  public currentPage: number = 1;
  @Input() articleList!: Articles;
  constructor(
    public articleService: ArticleService,
    public route: ActivatedRoute,
    private Router: Router
  ) {}

  ngOnInit() {
    this.offset = this.articleService.offset;
    this.limit = this.articleService.limit;
    this.currentPage = Math.ceil(this.offset / this.limit) + 1;
  }

  ngDoCheck(): void {
    if (this.articleService.listArticle) {
      this.limit = this.articleService.limit;
      this.offset = this.articleService.offset;
      this.currentPage = Math.ceil(this.offset / this.limit) + 1;
      if (this.articleService.listArticle.articlesCount > this.limit) {
        const maxPage: number = Math.ceil(
          this.articleService.listArticle.articlesCount / this.limit
        );
        this.listPage = new Array(maxPage).fill(0);
      }
    }
  }

  public handleChangePage(i: number) {
    if (i + 1 === this.currentPage || i < 0) return;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.currentPage = i + 1;
    this.offset = i * this.limit;
    this.articleService.offset = this.offset;
  }

  ngOnDestroy(): void {
    this.Subscription.unsubscribe();
  }
}
