import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "objectValue",
})
export class ObjectValuePipe implements PipeTransform {
  transform<T extends object>(object: T): any[] {
    return Object.values(object);
  }
}
