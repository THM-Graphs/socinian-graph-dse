import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { LangManager } from 'src/utils/LangManager';
import { Observable } from 'rxjs';

interface IProjectEntry {
  id: string;
  label: string;
  text?: string;
  icon?: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  public selectedCategory: string = 'introduction';
  public selectedText$!: Observable<string>;

  public lang = LangManager;

  public categories: IProjectEntry[] = [
    {
      label: 'PROJECT_CATEGORY_INTRODUCTION',
      id: 'introduction',
      icon: 'fa-book',
    },
    {
      label: 'PROJECT_CATEGORY_COWORKERS',
      id: 'staff',
      icon: 'fa-user',
    },
    {
      label: 'PROJECT_CATEGORY_PARTNERS',
      id: 'collaborators',
      icon: 'fa-handshake',
    },
    {
      label: 'PROJECT_CATEGORY_GUIDELINES',
      id: 'guidelines',
      icon: 'fa-info-circle',
    },
    {
      label: 'PROJECT_CATEGORY_METHODOLOGIES',
      id: 'digital-methods',
      icon: 'fa-project-diagram',
    },
    {
      label: 'PROJECT_CATEGORY_TEXT_COMPARE',
      id: 'text-collations',
      icon: 'fa-underline',
    },
    {
      label: 'PROJECT_CATEGORY_CITATIONS',
      id: 'digital-citations',
      icon: 'fa-link',
    },
  ];

  constructor(
    private projectService: ProjectService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const selectedCategory: string = params.category ?? 'introduction';
      this.onSelectProjectCategory(selectedCategory);
    });
  }

  public async onSelectProjectCategory(identifier: string): Promise<void> {
    this.selectedCategory = identifier;
    this.selectedText$ = this.projectService.getText(identifier);
    this.location.go(`/project/${identifier}`);
    this.scrollTop();
  }

  private scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
