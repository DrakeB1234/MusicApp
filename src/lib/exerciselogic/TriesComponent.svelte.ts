export class TriesComponent {
  private triesLeft = $state(0);
  private onTriesOut: () => void;

  constructor(tries: number, onTriesOut: () => void) {
    this.triesLeft = tries;
    this.onTriesOut = onTriesOut;
  }

  get triesLeftCount() {
    return this.triesLeft;
  }

  decrementTries() {
    this.triesLeft--;
    if (this.triesLeft <= 0) {
      this.onTriesOut();
    }
  }
}