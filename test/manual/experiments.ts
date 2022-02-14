import { FpsMeter } from '../../src/lib/FpsMeter';

export class Experiments {
  public addHelloToBody() {
    // const ld = new FpsMeter({
    //   width: 500,
    //   height: 200,
    //   columnWidth: 20,
    //   columnGapSize: 10,
    //   period: 1000,
    //   maxFps: 240,
    //   graphPadding: 30
    // });

    const fp = new FpsMeter({ period: 500 });
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  const experiments = new Experiments();
  experiments.addHelloToBody();
});
