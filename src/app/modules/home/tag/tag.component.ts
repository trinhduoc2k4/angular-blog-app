import { Router } from '@angular/router';
import { TagService } from './../../../services/tag.service';
import { Subscription } from 'rxjs';
import { ApiClientService } from 'src/app/services/api-client.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit, OnDestroy {
  public subscription = new Subscription();
  public listTags: string[] = [];
  public isDown: boolean = false;
  public tag: string = 'Tags';
  constructor(
    private apiClient: ApiClientService,
    public tagService: TagService,
    private Router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.apiClient.getTags().subscribe((res) => {
        this.listTags = res.tags.filter(item => item !== '');
      })
    );
  }

  public handleChangeTag(t: string) {
    this.tagService.tag = `#${t}`;
    this.tag = this.tagService.tag;
    this.isDown = false;
    this.Router.navigate(['home']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
