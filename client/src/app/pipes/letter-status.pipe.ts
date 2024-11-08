import { Pipe, PipeTransform } from '@angular/core';
import { TRANSCRIPTION_STATUS } from '../constants/TRANSCRIPTION_STATUS';

@Pipe({
  name: 'letterStatus',
})
export class LetterStatusPipe implements PipeTransform {
  transform(status: number): string {
    switch (Number(status)) {
      case TRANSCRIPTION_STATUS.METADATA:
        return 'STATUS_PIPE_METADATA';
      case TRANSCRIPTION_STATUS.TRANSCRIPTION:
        return 'STATUS_PIPE_TRANSCRIPTION';
      case TRANSCRIPTION_STATUS.CONCLUSION:
        return 'STATUS_PIPE_FULL_CONCLUSION';
      default:
        return 'MISSING_STATUS';
    }
  }
}
