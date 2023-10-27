import { Component } from "@angular/core";
import { LangManager, Languages } from "../../../../utils/LangManager";
import { LocalStorage } from "../../../../utils/LocalStorage";

export interface NavItem {
  name: string;
  routerLink: string;
}

@Component({
  selector: "app-navbar",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent {
  public lang = LangManager;
  public languages = Languages;
  public isEllipseMenuActive: boolean = false;

  private langStorage: LocalStorage = new LocalStorage("language");

  public navItems: NavItem[] = [
    {
      name: "NAV_ITEM_HOME",
      routerLink: "/home",
    },
    {
      name: "NAV_ITEM_PROJECT",
      routerLink: "/project",
    },
    {
      name: "NAV_ITEM_COLLECTION",
      routerLink: "/collection",
    },
    {
      name: "NAV_ITEM_SECTION",
      routerLink: "/section",
    },
    {
      name: "NAV_ITEM_REGISTER",
      routerLink: "/register",
    },
  ];

  public availableLanguages: { name: string; language: Languages }[] = [
    {
      name: "NAV_SWITCH_GERMAN",
      language: Languages.german,
    },
    {
      name: "NAV_SWITCH_ENGLISH",
      language: Languages.english,
    },
  ];

  public onLanguageSwitch(language: Languages): void {
    this.lang.setLanguage(language);
    this.langStorage.setItems(language);
  }
}
