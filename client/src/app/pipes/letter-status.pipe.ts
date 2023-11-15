import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "letterStatus",
})
export class LetterStatusPipe implements PipeTransform {
  transform(status: number): string {
    switch (Number(status)) {
      case 40:
        return "STATUS_PIPE_METADATA";
      case 70:
        return "STATUS_PIPE_TRANSCRIPTION";
      case 100:
        return "STATUS_PIPE_FULL_CONCLUSION";
      default:
        return "MISSING_STATUS";
    }
  }
}
