import { FpsMeter } from '../../src/lib/FpsMeter';

export class Experiments {
  public addHelloToBody() {
    const fp1 = new FpsMeter({ theme: 'light', position: 'topLeft' });
    const fp2 = new FpsMeter({ theme: 'dark' });
    const fp3 = new FpsMeter({ theme: 'colorful', position: 'bottomLeft' });
    const fp4 = new FpsMeter({ theme: 'transparent', position: 'bottomRight' });
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  const experiments = new Experiments();
  experiments.addHelloToBody();
});
