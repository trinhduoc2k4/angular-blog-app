import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Article } from './../../../Models';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit, OnDestroy {
  @Input() article!: Article;
  public isLiked: boolean = false;
  public likedCount: number = 0;
  private subject = new Subject<boolean>();
  @ViewChild('liked') likeElement!: ElementRef;
  @ViewChild('unLiked') unLikeElement!: ElementRef;
  constructor(
    private apiClient: ApiClientService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (this.article) {
      this.isLiked = this.article.favorited;
      this.likedCount = this.article.favoritesCount;
      this.article.tagList = this.article.tagList.filter(item => item !== "");
    }

    this.subject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((isLiked) => {
          if (isLiked)
            return this.apiClient.favoriteArticle(this.article.slug);
          else return this.apiClient.unfavoriteArticle(this.article.slug);
        })
      )
      .subscribe((res) => {
        // console.log(res);
      });
  }

  public handleActionLike() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth']);
      return;
    }
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.likedCount++;
    } else {
      this.likedCount--;
    }
    this.animation();
    this.subject.next(this.isLiked);
  }

  public animation() {
    if (this.isLiked) {
      this.likeElement.nativeElement.classList.add('liked');
    } else {
      this.likeElement.nativeElement.animate(
        [
          {
            opacity: 1,
            transform: 'transLateY(-10px)',
          },
          {
            opacity: 0.7,
            transform: 'transLateY(-25px)',
          },
          {
            opacity: 0,
            transform: 'transLateY(-40px)',
          },
        ],
        {
          // timing options
          duration: 500,
          easing: 'linear',
        }
      );
      const id = setTimeout(() => {
        this.likeElement.nativeElement.classList.remove('liked');
        clearTimeout(id);
      }, 500);

    }
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
  }
}
