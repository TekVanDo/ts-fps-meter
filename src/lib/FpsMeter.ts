interface FpsMeterConfig {
  width: number,
  height: number,
  columnWidth: number,
  gapSize: number,
  bgColor: string,
  columnColor: string;
  textColor: string;
  min: number,
  max: number,
}

const defaultConfig: FpsMeterConfig = {
  width: 110,
  height: 40,
  columnWidth: 4,
  gapSize: 1,
  bgColor: '#fffffff',
  columnColor: '#fffffff',
  textColor: '#fffffff',
  min: 0,
  max: 60,
}

const positions = {
  'top-left': 'left: 0; top: 0;',
  'top-right': 'right: 0; top: 0;',
  'bottom-right': 'right: 0; bottom: 0;',
  'bottom-left': 'left: 0; bottom: 0;'
};

export class FpsMeter {
  private min;
  private max;
  private pixelRatio = Math.round(window.devicePixelRatio || 1);
  private WIDTH;
  private HEIGHT;
  private TEXT_X;
  private TEXT_Y;
  private GRAPH_X;
  private GRAPH_Y;
  private GRAPH_WIDTH;
  private GRAPH_HEIGHT;
  private canvas;
  private context;
  private bg = '#FF0000';
  private fg = '#000000';
  private maxValue = 60;
  private settings: FpsMeterConfig;


  constructor(config: FpsMeterConfig) {

    this.createIndicator();
  }

  setConfig(config: FpsMeterConfig) {
    const currentConfig = { ...defaultConfig, ...config };
    const ratio = Math.round(window.devicePixelRatio || 1);
    this.settings = { ...defaultConfig, ...config };
  }

  private createIndicator() {
    const {  } = this.settings;
    this.min = Infinity;
    this.max = 0;
    this.pixelRatio = Math.round(window.devicePixelRatio || 1);
    this.WIDTH = 80 * this.pixelRatio;
    this.HEIGHT = 48 * this.pixelRatio;
    this.TEXT_X = 3 * this.pixelRatio;
    this.TEXT_Y = 2 * this.pixelRatio;
    this.GRAPH_X = 3 * this.pixelRatio;
    this.GRAPH_Y = 15 * this.pixelRatio;
    this.GRAPH_WIDTH = 74 * this.pixelRatio;
    this.GRAPH_HEIGHT = 30 * this.pixelRatio;

    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.canvas.style.cssText = 'width:80px;height:48px';

    this.context = this.canvas.getContext('2d');
    this.context.font = 'bold ' + (9 * this.pixelRatio) + 'px Helvetica,Arial,sans-serif';
    this.context.textBaseline = 'top';

    this.context.fillStyle = this.fg;
    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.context.fillStyle = this.bg;
    this.context.fillText(name, this.TEXT_X, this.TEXT_Y);
    this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

    this.ticks();
  }

  ticks() {
    let opts: any = this.config || {};
    let ctx = this.canvas;
    let w = this.canvas.width;
    let h = this.canvas.height;
    let count = 0;
    let lastTime = 0;
    let values = opts.values || Array(this.canvas.width);
    let period = opts.period || 1000;
    let max = opts.max || 100;
    let name = 'fps';

    console.log('eba');
    const mesure = () => {
      count++;
      let t = +new Date();
      console.log(t - lastTime > period);
      if (t - lastTime > period) {
        lastTime = t;
        values.push(count / (this.max * period * 0.001));
        values = values.slice(-w);
        count = 0;
        //
        // ctx.clearRect(0, 0, w, h);
        // ctx.fillStyle = getComputedStyle(that.this.canvas).color;
        // for (let i = w; i--;) {
        //   let value = values[i];
        //   if (value == null) break;
        //   ctx.fillRect(i, h - h * value, 1, h * value);
        // }
        //
        // that.valueEl.innerHTML = (values[values.length - 1] * max).toFixed(1);
        const value = count / (this.max * period * 0.001);
        const min = Math.min(this.min, value);
        const max = Math.max(this.max, value);

        this.context.fillStyle = this.bg;
        this.context.globalAlpha = 1;
        this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
        this.context.fillStyle = this.fg;
        this.context.fillText(Math.round(value) + ' ' + name + ' (' + Math.round(min) + '-' + Math.round(max) + ')', this.TEXT_X, this.TEXT_Y);
        this.context.drawImage(this.canvas, this.GRAPH_X + this.pixelRatio, this.GRAPH_Y, this.GRAPH_WIDTH - this.pixelRatio, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.pixelRatio, this.GRAPH_HEIGHT);

        this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.pixelRatio, this.GRAPH_Y, this.pixelRatio, this.GRAPH_HEIGHT);

        this.context.fillStyle = this.bg;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.pixelRatio, this.GRAPH_Y, this.pixelRatio, Math.round((1 - (value / this.maxValue)) * this.GRAPH_HEIGHT));
        requestAnimationFrame(mesure);
      } else {
        requestAnimationFrame(mesure);
      }
    };
    requestAnimationFrame(mesure);
  };
}
