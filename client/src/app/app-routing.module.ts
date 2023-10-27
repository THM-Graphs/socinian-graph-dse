import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./view/pages/home/home.component";
import { RegisterComponent } from "./view/pages/register/register.component";
import { CollectionComponent } from "./view/pages/collection/collection.component";
import { CommunicationView } from "./view/pages/communication-view/communication-view.component";
import { SearchResultsComponent } from "./view/pages/search-results/search-results.component";
import { ProjectComponent } from "./view/pages/project/project.component";
import { SectionComponent } from "./view/pages/section/section.component";
import { EntityComponent } from "./view/pages/entity/entity.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "project", component: ProjectComponent },
  { path: "project/:category", component: ProjectComponent },
  { path: "collection", component: CollectionComponent },
  { path: "section", component: SectionComponent },
  { path: "section/:section", component: SectionComponent },
  { path: "register", component: RegisterComponent },
  { path: "entry/:guid", component: EntityComponent },
  { path: "id/:guid", redirectTo: "view/:guid" },
  { path: "view/:guid", component: CommunicationView },
  { path: "search/:searchPhrase", component: SearchResultsComponent },
  { path: "**", redirectTo: "/home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
