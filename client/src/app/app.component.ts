import { Component } from "@angular/core";
import { LocalStorage } from "../utils/LocalStorage";
import { LangManager, Languages } from "../utils/LangManager";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  constructor(private router: Router) {
    const langStorage: LocalStorage = new LocalStorage("language");
    const langStorageCode: Languages = langStorage.getItems() as Languages;

    if ((window.navigator.language.slice(0, 2) === "de" && !langStorageCode) || langStorageCode === Languages.german) {
      LangManager.setLanguage(Languages.german);
    } else {
      LangManager.setLanguage(Languages.english);
    }
  }

  onActivate() {
    if (this.router.url.indexOf("/search/") > -1) return;

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
