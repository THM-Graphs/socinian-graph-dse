import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GraphQLModule } from "./graphql.module";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HomeComponent } from "./view/pages/home/home.component";
import { NavigationComponent } from "./view/components/navigation/navigation.component";
import { FooterComponent } from "./view/components/footer/footer.component";
import { RegisterComponent } from "./view/pages/register/register.component";
import { Apollo } from "apollo-angular";
import { CollectionComponent } from "./view/pages/collection/collection.component";
import { LetterStatusPipe } from "./pipes/letter-status.pipe";
import { CommunicationView } from "./view/pages/communication-view/communication-view.component";
import { SearchResultsComponent } from "./view/pages/search-results/search-results.component";
import { SearchComponent } from "./view/components/search/search.component";
import { FormsModule } from "@angular/forms";
import { ObjectValuePipe } from "./pipes/object-value.pipe";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { TextViewComponent } from "./view/components/text-view/text-view.component";
import { AnnotationListComponent } from "./view/components/annotation-list/annotation-list.component";
import { SectionService } from "./services/section.service";
import { CommunicationService } from "./services/communication.service";
import { EntityService } from "./services/entity.service";
import { SearchService } from "./services/search.service";
import { ImageBoxComponent } from "./view/components/image-box/image-box.component";
import { SectionListComponent } from "./view/components/section-list/section-list.component";
import { LoadingSpinnerComponent } from "./view/components/loading-spinner/loading-spinner.component";
import { MarkdownViewComponent } from "./view/components/markdown-view/markdown-view.component";
import { ProjectComponent } from "./view/pages/project/project.component";
import { CommunicationsListComponent } from "./view/components/communications-list/communications-list.component";
import { CommunicationsFilterComponent } from "./view/components/communications-filter/communications-filter.component";
import { SectionComponent } from "./view/pages/section/section.component";
import { EntityComponent } from "./view/pages/entity/entity.component";

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        NavigationComponent,
        FooterComponent,
        RegisterComponent,
        CollectionComponent,
        LetterStatusPipe,
        CommunicationView,
        SearchResultsComponent,
        SearchComponent,
        ObjectValuePipe,
        SafeHtmlPipe,
        TextViewComponent,
        AnnotationListComponent,
        ImageBoxComponent,
        SectionListComponent,
        LoadingSpinnerComponent,
        MarkdownViewComponent,
        ProjectComponent,
        CommunicationsListComponent,
        CommunicationsFilterComponent,
        SectionComponent,
        EntityComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule, FormsModule, AppRoutingModule, GraphQLModule], providers: [Apollo, SectionService, CommunicationService, EntityService, SearchService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
