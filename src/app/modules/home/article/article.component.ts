import { TagService } from './../../../services/tag.service';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from './../../../services/user.service';
import { AuthService } from './../../../services/auth.service';
import { Articles, Article } from './../../../Models';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, DoCheck, ViewEncapsulation } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { Router } from '@angular/router';
import { images } from 'src/assets/images';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, OnDestroy, DoCheck {
  public articles!: Articles;
  public subscription = new Subscription();
  public isLoggedIn: boolean = false;
  public tag: string = 'Global';
  public listTabs: string[] = ['Global'];
  public isPending: boolean = true;
  public offset: number = 0;
  public isNothing: boolean = false;
  public imgs: string[] = images;

  constructor(
    private apiClient: ApiClientService,
    private router: Router,
    public authService: AuthService,
    public userService: UserService,
    public articleService: ArticleService,
    public tagService: TagService
  ) {}

  ngOnInit() {
    if (this.tagService.tag) {
      this.tag = this.articleService.tag;
    }
    this.getData(null, this.offset);
  }

  ngDoCheck(): void {
    if (this.tagService.tag && this.tagService.tag !== this.tag) {
      this.tag = this.tagService.tag;
      if (window.innerWidth > 768) {
        this.listTabs[2] = this.tag;
      } else this.listTabs.splice(2, 1);
      this.articleService.offset = 0;
      this.offset = 0;
      this.isPending = true;
      this.getArticleByTag();
    }

    if (this.isLoggedIn !== this.authService.isLoggedIn) {
      this.isLoggedIn = this.authService.isLoggedIn;
      if (this.authService.isLoggedIn) {
        this.listTabs[1] = 'Your Feeds';
      } else
        this.listTabs = this.listTabs.filter((item) => item !== 'Your Feeds');
    }
    if (this.offset !== this.articleService.offset) {
      this.offset = this.articleService.offset;
      this.handleActiveTab(this.tag);
    }
  }

  public handleActiveTab(t: string) {
    if (t !== this.tag) {
      this.offset = 0;
      this.articleService.offset = 0;
    }
    this.tag = t;
    if (t !== 'Your Feeds' && t !== 'Global') this.tagService.tag = t;
    else {
      this.tagService.tag = '';
    }
    this.isPending = true;
    if (this.tag === 'Global') {
      this.getArticleGlobal();
    } else if (this.tag === 'Your Feeds') this.getArticleFeeds();
    else this.getArticleByTag();
  }

  public getData(t: string | null, offset: number | null) {
    const body: {
      tag?: string;
      offset?: number;
    } = {};
    if (t && t.length > 0) body.tag = t.replace('#', '');
    if (this.offset) body.offset = this.offset;

    this.isPending = true;
    this.subscription.add(
      this.apiClient.getListArticles(body).subscribe((res) => {
        if (res.articlesCount === 0 || res.articles.length <= 0) {
          this.isNothing = true;
        }
        if (this.tag === 'Your Feeds') {
          const newArticles: Article[] = res.articles.filter(
            (item) => item.author.username === this.userService.user?.username
          );

          this.articles = {
            articles: newArticles,
            articlesCount: res.articlesCount - 3,
          };
        } else this.articles = { ...res };
        this.isPending = false;
        this.updatePagination();
      })
    );
  }

  public getArticleByTag() {
    const t: string = this.tag.replace('#', '');
    this.getData(t, null);
  }

  public getArticleGlobal() {
    this.getData(null, null);
  }

  public getArticleFeeds() {
    this.getData(null, null);
  }

  public updatePagination() {
    this.articleService.listArticle = this.articles;
  }

  public handleChangeArticle(e: MouseEvent, slug: string, username: string) {
    const ele = e.target as Element;
    if (!ele.closest('.article-action') && !ele.closest('.article-user')) {
      this.router.navigate(['/editor/article/', slug]);
    }
    if (ele.closest('.article-user')) {
      this.router.navigate(['/profile/', `@${username}`]);
    }
  }

  ngOnDestroy(): void {
    this.tag = 'Global';
    this.tagService.tag = '';
    this.articleService.offset = 0;
    this.offset = 0;
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
