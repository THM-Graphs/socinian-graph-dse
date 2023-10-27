import { Component } from "@angular/core";
import { LangManager } from "../../../../utils/LangManager";

interface Project {
  name: string;
  href: string;
  imageSrc: string;
}

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  public lang = LangManager;

  public projectList: Project[] = [
    {
      name: "Akademie der Wissenschaften und der Literatur | Mainz",
      href: "http://www.adwmainz.de/",
      imageSrc: "assets/images/socinian/logo_adw.png",
    },
    {
      name: "Johannes a Lasco Bibliothek Emden",
      href: "https://www.jalb.de/",
      imageSrc: "assets/images/socinian/logo_jalb.png",
    },
    {
      name: "Deutsche Forschungsgemeinschaft",
      href: "https://gepris.dfg.de/gepris/projekt/324518514",
      imageSrc: "assets/images/socinian/logo_dfg.png",
    },
  ];
}
