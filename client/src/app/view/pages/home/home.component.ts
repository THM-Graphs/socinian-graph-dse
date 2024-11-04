import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { LangManager, Languages } from 'src/utils/LangManager';
import { Observable } from 'rxjs';

const PUBLISHED_SECTION: string = 'ed_f13a5020-2370-4d65-917c-325ca9e77f31';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public lang = LangManager;
  public language: typeof Languages = Languages;

  public publishedItem: string = PUBLISHED_SECTION;
  public introduction$!: Observable<string>;

  constructor(
    private router: Router,
    private projectService: ProjectService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.introduction$ = this.projectService.getText('landing-page');
  }

  public async onSearchEventHandler($event: string): Promise<void> {
    await this.router.navigate(['search', $event]);
  }
}
