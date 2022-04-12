import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  public newArticle!: FormGroup;
  public slug!: string;
  public errorTitle!: string;
  public checkLoad: boolean = true;

  constructor(
    public router: ActivatedRoute,
    public fb: FormBuilder,
    public apiService: ApiClientService,
    public route: Router
  ) {}

  ngOnInit() {

    this.newArticle = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      body: ["", Validators.required],
      tag: ""
    });
    this.router.params
      .pipe(
        switchMap((res) => {
          this.slug = res['slug'];
          return this.apiService.getArticlesWithSlug(res['slug']);
        })
      )
      .subscribe((res) => {
        this.newArticle.patchValue({
          title: res.article.title,
          description: res.article.description,
          body: res.article.body
        });
        if (res.article.tagList.length > 0) {
          const tags = res.article.tagList.join('#');
          this.newArticle.patchValue({
            tag: `#${tags}`
          });
        }
        this.checkLoad = false;
      });
  }

  updateArticle() {
    let tagString = this.newArticle.controls['tag'].value;
    let tagArr: string[] = tagString.split("#");
    tagArr = tagArr.filter(item => item !== "");
    let body = {
      article: {
        title: this.newArticle.controls['title'].value,
        description: this.newArticle.controls['description'].value,
        body: this.newArticle.controls['body'].value,
        tagList: tagArr,
      },
    };
    this.apiService.updateArticle(this.slug, body).subscribe({
      next: res => {
        this.route.navigate(['/editor/article', res.article.slug]);
      },
      error: error => {
        this.errorTitle = error.error.errors.title[0];
      }
    })
  }
}
