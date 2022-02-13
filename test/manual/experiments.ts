import { FpsMeter } from '../../src/lib/FpsMeter';

export class Experiments {
  public addHelloToBody() {
    const ld = new FpsMeter({ color: 'red' });
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  const experiments = new Experiments();
  experiments.addHelloToBody();
});
