export class SocinianUtils {
  public static translateCalendar(calendarTag: string): string {
    switch (calendarTag) {
      case "#Gregorian #Julian":
        return "Julianischer und Gregorianischer Kalender";
      case "#Gregorian":
        return "Gregorianischer Kalender";
      case "#Julian":
        return "Julianischer Kalender";
      default:
        return "Kalendersystem unbekannt";
    }
  }
}
