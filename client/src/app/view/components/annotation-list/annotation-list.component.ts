import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AnnotationListService } from "../../../services/annotation-list.service";
import { LangManager } from "../../../../utils/LangManager";

@Component({
  selector: "app-annotation-list",
  templateUrl: "./annotation-list.component.html",
  styleUrls: ["./annotation-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AnnotationListComponent implements OnInit {
  public lang = LangManager;

  constructor(public annotationListService: AnnotationListService) {}

  ngOnInit(): void {}
}
