import { hslColPerc } from './helpers';

interface FpsMeterConfig {
  width: number,
  height: number,
  graphPadding: number,
  columnWidth: number,
  columnGapSize: number,
  bgColor: string,
  columnColor: string;
  textColor: string;
  minFps: number,
  maxFps: number,
  period: number;
  textFontSize: number;
  fontSize: number;
  font: string;
  position: string;
  colerfull: boolean;
}

const positions = {
  'topLeft': 'left: 0; top: 0;',
  'topRight': 'right: 0; top: 0;',
  'bottomRight': 'right: 0; bottom: 0;',
  'bottomLeft': 'left: 0; bottom: 0;'
};

const defaultConfig: FpsMeterConfig = {
  width: 250,
  height: 100,
  graphPadding: 5,
  columnWidth: 4,
  columnGapSize: 1,
  bgColor: 'rgb(34, 34, 34)',
  columnColor: '#3f3f3f',
  textColor: '#ffffff',
  minFps: 0,
  maxFps: 240,
  period: 500,
  font: 'Consolas, "Andale Mono", monospace',
  textFontSize: 12,
  fontSize: 24,
  position: positions.topRight,
  colerfull: false
};

export class FpsMeter {
  private settings: FpsMeterConfig;
  private averageFps: number;
  private currentFps: number;
  private columnValues: Array<number>;
  private columnsLeftGap: number;
  private canvas;
  private context;

  constructor(config: Partial<FpsMeterConfig>) {
    this.setConfig(config);
    this.createIndicator();
  }

  setConfig(config: Partial<FpsMeterConfig>) {
    const currentConfig = { ...defaultConfig, ...config };
    const ratio = Math.round(window.devicePixelRatio || 1);
    let { width, height, columnWidth, columnGapSize, fontSize } = currentConfig;
    width = width * ratio;
    height = height * ratio;
    columnWidth = columnWidth * ratio;
    columnGapSize = columnGapSize * ratio;
    fontSize = fontSize * ratio;
    this.settings = { ...currentConfig, width, height, columnWidth, columnGapSize, fontSize };
  }

  private createIndicator() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    const { width, height, position, bgColor } = this.settings;
    this.calcColumnNumber();
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.cssText = `width:${width}px;height:${height}px;position:absolute;${position}`;
    this.context = this.canvas.getContext('2d');
    this.context.textBaseline = 'top';
    this.context.fillStyle = bgColor;
    this.context.fillRect(0, 0, width, height);
    this.ticks();
  }

  private calcColumnNumber() {
    const { width, columnGapSize, columnWidth, graphPadding } = this.settings;
    const withWithoutPadding = width - graphPadding * 2;
    const val = withWithoutPadding / (columnWidth + columnGapSize);
    const remainder = withWithoutPadding % (columnWidth + columnGapSize);
    this.columnsLeftGap = remainder / 2;
    const numberOfColumns = Math.floor(val);
    this.columnValues = Array.from({ length: numberOfColumns }, () => 0);
  }

  // private getTime() {
  //   var perf = w.performance;
  //   if (perf && (perf.now || perf.webkitNow)) {
  //     var perfNow = perf.now ? 'now' : 'webkitNow';
  //     getTime = perf[perfNow].bind(perf);
  //   } else {
  //     return +new Date();
  //   }
  // }


  ticks() {
    let { period, bgColor, width, height, maxFps } = this.settings;
    let lastTime = 0;
    let count = 0;
    const mesure = () => {
      count++;
      let currentTime = +new Date();
      if (currentTime - lastTime > period) {
        lastTime = currentTime;
        this.columnValues.forEach((one, i) => {
          if (i !== 0) {
            this.columnValues[i - 1] = one;
          }
        });

        let fps = (count - 1) / (period * 0.001);
        const fpsForShow = fps > maxFps ? maxFps : fps;
        let percentageFps = fps / (maxFps / 100);
        percentageFps = percentageFps > 100 ? 100 : percentageFps;
        count = 0;
        this.columnValues[this.columnValues.length - 1] = percentageFps;
        this.context.clearRect(0, 0, width, height);
        this.context.fillStyle = bgColor;
        this.context.fillRect(0, 0, width, height);
        this.renderColumns();
        this.renderText(fpsForShow);
      }
      requestAnimationFrame(mesure);
    };
    requestAnimationFrame(mesure);
  };

  private renderText(fps) {
    const { font, height, fontSize, textFontSize, width, graphPadding } = this.settings;
    this.context.fillStyle = this.settings.textColor;
    const textY = height / 2 - textFontSize / 2;
    const fpsY = height / 2 - fontSize / 2;
    this.context.textAlign = 'left';
    this.context.font = `normal ${textFontSize}px ${font}`;
    this.context.fillText('FPS', graphPadding, textY);
    this.context.textAlign = 'right';
    this.context.font = `normal ${fontSize}px ${font}`;
    this.context.shadowColor = '#000000';
    this.context.shadowBlur = 1;
    this.context.strokeText(fps, width - graphPadding, fpsY);
    this.context.fillText(fps, width - graphPadding, fpsY);
  }

  private renderColumns() {
    const { columnWidth, columnColor, columnGapSize, height, graphPadding } = this.settings;
    this.columnValues.forEach((one, i) => {
      if (!one) {
        return;
      }

      this.context.fillStyle = columnColor;
      const x = this.columnsLeftGap + columnGapSize + graphPadding + (columnWidth + columnGapSize) * i;
      const value = (height - graphPadding * 2) / 100 * one;
      const y = height - value - graphPadding;
      const color = hslColPerc(one);
      this.context.fillStyle = color;
      this.context.fillRect(x, y, this.settings.columnWidth, value);
    });
  }
}
