export class BackgroundTimer {

  private static timer: NodeJS.Timeout | null = null;

  static start(cb: () => void, time: number = 1000) {
    if (!this.timer) {
      this.timer = setInterval(cb, time);
    }
  }
  static stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}