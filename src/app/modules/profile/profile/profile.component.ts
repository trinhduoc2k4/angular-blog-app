import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, switchMap } from 'rxjs';
import { ApiClientService } from '../../../services/api-client.service';
import { Article, Articles, Profile } from 'src/app/Models';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { images } from 'src/assets/images';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public img: string = '../../../../assets/images/Group289.png';
  public banner: string = '../../../../assets/images/Rectangle557.png';
  public isLoading: boolean = true;
  public isLoadingProfile: boolean = true;
  public subscription = new Subscription();
  public articles!: Articles;
  public author!: Profile | null;
  public authorName: string = '';
  public subject = new Subject<string>();
  public unFollow: boolean = false;
  public isOwn: boolean = true;
  public count: number = 0;
  public offset: number = 0;
  public limit: number = 0;
  public pages = new Array();
  public currentPage: number = 1;
  public isNothing: boolean = false;
  public imgs: string[] = images;
  constructor(
    private apiClientService: ApiClientService,
    public articleService: ArticleService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.limit = this.articleService.limit;
    this.subject
      .pipe(switchMap((username) => this.apiClientService.getProfile(username)))
      .subscribe((res) => {
        this.author = res.profile;
        this.unFollow = res.profile.following;
        if (res.profile.username === this.userService.user.username) {
          this.isOwn = true;
        } else {
          this.isOwn = false;
        }
        this.isLoadingProfile = false;
      });
  }

  public currentTab: string = 'mine';

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params['username']) {
          this.authorName = params['username'].replace(/@/gi, '');
          this.getData({ author: this.authorName });
          this.subject.next(this.authorName);
        }
      })
    );
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

  public getArticles(tab: string) {
    if (tab === this.currentTab) return;
    this.currentTab = tab;
    if (this.currentTab === 'liked') {
      this.getData({ favorited: this.authorName });
    } else this.getData({ author: this.authorName });
  }

  public getData(body: {
    favorited?: string;
    author?: string;
    offset?: number;
  }) {
    this.isLoading = true;
    this.subscription.add(
      this.apiClientService.getListArticles(body).subscribe((res) => {
        if (res.articlesCount === 0 || res.articles.length <= 0) {
          this.isNothing = true;
        }
        else this.isNothing = false;
        if (this.currentTab === 'mine') {
          this.articles = {
            ...res,
          };
        } else {
          const favorited: Article[] = res.articles.filter(
            (item) => item.favorited
          );
          this.articles = {
            articles: favorited,
            articlesCount: favorited.length,
          };
        }
        this.isLoading = false;
        this.count = this.articles.articlesCount;
        this.pages = new Array(Math.ceil(this.count / this.limit)).fill(0);
      })
    );
  }
  public handleFollow() {
    if (!this.unFollow) {
      this.apiClientService.followUser(this.authorName).subscribe((res) => {});
      this.unFollow = !this.unFollow;
    } else {
      this.apiClientService
        .unfollowUser(this.authorName)
        .subscribe((res) => {});
      this.unFollow = !this.unFollow;
    }
  }
  public handleChangePage(i: number) {
    if (i + 1 === this.currentPage) return;
    if (this.currentTab === 'liked') {
      this.getData({ favorited: this.authorName, offset: this.limit * i });
    } else this.getData({ author: this.authorName, offset: this.limit * i });
    this.currentPage = i + 1;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.isLoading = true;
    this.isLoadingProfile = true;
  }
}
