import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';
import { Article, Comments, User, Comment } from 'src/app/Models';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit, DoCheck {
  public articleDetail!: Article;
  public allComments!: Comments;
  public slug!: string;
  public login!: string | null;
  public isFollow!: boolean;
  public isFavorite!: boolean;
  public favoriteCount!: number;
  public user!: User;
  public textArea!: FormGroup;
  public isAuthor: boolean = false;

  constructor(
    private myService: ApiClientService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private route: Router,
    public userService: UserService,
    public fb: FormBuilder,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.login = this.authService.getToken();
    this.textArea = this.fb.group({
      cmt: '',
    });
    this.router.params
      .pipe(
        switchMap((res) => {
          this.slug = res['slug'];
          return this.myService.getArticlesWithSlug(res['slug']);
        })
      )
      .subscribe((res) => {
        this.articleDetail = res.article;
        if (this.articleDetail && this.user) {
          this.isAuthor =
            this.articleDetail.author.username === this.user.username;
        }
        // console.log(this.articleDetail);
        this.favoriteCount = this.articleDetail.favoritesCount;
        this.isFollow = this.articleDetail.author.following;
        this.isFavorite = this.articleDetail.favorited;
      });
    this.myService.getCommentsFromArticle(this.slug).subscribe((res) => {
      this.allComments = res;
    });
  }

  ngDoCheck() {
    if (this.authService.getToken()) {
      this.login = this.authService.getToken();
      this.user = this.userService.user;
      this.myService.getUser().subscribe((res) => {
        this.user = res.user;
        if (this.articleDetail) {
          this.isAuthor =
            this.articleDetail.author.username === this.user.username;
        }
      });
    }
  }

  checkLogin(): boolean {
    const token: string | null = this.authService.getToken();
    if (token) return true;
    else {
      const url = this.route.url;
      this.authService.redirectUrl = url;
      this.route.navigate(['/auth']);
      return false;
    }
  }

  followUser() {
    if (!this.checkLogin()) return;
    this.isFollow = !this.isFollow;
    if (!this.login) {
      this.route.navigate(['/auth/sign-in']);
    } else {
      this.myService
        .followUser(this.articleDetail.author.username)
        .subscribe((res) => {});
    }
  }

  unFollowUser() {
    if (!this.checkLogin()) return;
    this.isFollow = !this.isFollow;
    this.myService
      .unfollowUser(this.articleDetail.author.username)
      .subscribe((res) => {});
  }

  favorite() {
    if (!this.checkLogin()) return;
    this.isFavorite = !this.isFavorite;
    this.favoriteCount++;
    this.myService.favoriteArticle(this.slug).subscribe((res) => {
      console.log(res.article);
    });
  }

  unFavorite() {
    if (!this.checkLogin()) return;
    this.isFavorite = !this.isFavorite;
    this.favoriteCount--;
    this.myService.unfavoriteArticle(this.slug).subscribe((res) => {
      console.log(res);
    });
  }

  postCmt() {
    let cmtUser = {
      comment: {
        body: this.textArea.controls['cmt'].value,
      },
    };
    this.myService
      .addCommentsToArticle(this.slug, cmtUser)
      .pipe(
        switchMap((res) => {
          return this.myService.getCommentsFromArticle(this.slug);
        })
      )
      .subscribe((res) => {
        this.textArea.controls['cmt'].setValue('');
        this.allComments = res;
      });
  }

  delComment(id: Comment) {
    this.allComments.comments = this.allComments.comments.filter(
      (res) => res.id !== id.id
    );
    console.log(this.allComments);

    this.myService
      .deleteComment(this.slug, id.id)
      .pipe(
        switchMap((res) => {
          return this.myService.getCommentsFromArticle(this.slug);
        })
      )
      .subscribe();
  }

  delArticle() {
    this.myService.deleteArticle(this.slug).subscribe();
    this.route.navigate(['/home']);
  }
}
