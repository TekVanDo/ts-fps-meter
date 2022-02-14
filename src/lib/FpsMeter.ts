import { hslColPerc } from './helpers';
import { FpsMeterConfig, FpsMeterOptions } from '../interfaces/fps-meter';
import { baseTheme, themes } from './themes';

const positions = {
  'topLeft': 'left: 0; top: 0;',
  'topRight': 'right: 0; top: 0;',
  'bottomRight': 'right: 0; bottom: 0;',
  'bottomLeft': 'left: 0; bottom: 0;'
};

const defaultConfig: FpsMeterConfig = {
  width: 110,
  height: 40,
  columnWidth: 4,
  columnGapSize: 1,
  minFps: 0,
  maxFps: 60,
  period: 500,
  position: 'topRight',
  theme: baseTheme
};

export class FpsMeter {
  private settings: FpsMeterConfig;
  private averageFps: number;
  private columnValues: Array<number>;
  private columnsLeftGap: number;
  private canvas;
  private context;
  private started = false;

  constructor(config: Partial<FpsMeterOptions>) {
    this.setConfig(config);
    this.createIndicator();
  }

  setConfig(config: Partial<FpsMeterOptions>) {
    let theme = baseTheme;
    if (typeof config.theme === 'string') {
      theme = { ...theme, ...themes[config.theme] };
    } else {
      theme = { ...theme, ...config.theme };
    }
    const currentConfig = { ...defaultConfig, ...config, theme };
    const ratio = Math.round(window.devicePixelRatio || 1);
    let { width, height, columnWidth, columnGapSize, } = currentConfig;

    let { fontSize } = currentConfig.theme;
    width = width * ratio;
    height = height * ratio;
    columnWidth = columnWidth * ratio;
    columnGapSize = columnGapSize * ratio;
    fontSize = fontSize * ratio;
    this.settings = { ...currentConfig, width, height, columnWidth, columnGapSize };
    this.settings.theme.fontSize = fontSize;
  }

  private createIndicator() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    const { width, height, position } = this.settings;
    this.calcColumnNumber();
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.cssText = `width:${width}px;height:${height}px;position:absolute;${positions[position]}`;
    this.context = this.canvas.getContext('2d');
    this.context.textBaseline = 'top';

    this.start();
  }

  private calcColumnNumber() {
    const { width, columnGapSize, columnWidth } = this.settings;
    const withWithoutPadding = width - this.settings.theme.graphPadding * 2;
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
  destroy() {
    this.stop();
    this.canvas.remove();
  }

  stop() {
    this.started = false;
  }

  start() {
    this.started = true;
    let { period, width, height, maxFps } = this.settings;
    let lastTime = 0;
    let count = 0;
    const mesure = () => {
      if (!this.started) {
        return;
      }
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
        this.renderBackground(fps);
        this.renderColumns();
        this.renderText(fpsForShow, fps);
      }
      requestAnimationFrame(mesure);
    };
    requestAnimationFrame(mesure);
  };

  private renderBackground(fps) {
    const { height, width } = this.settings;
    const { bgColor, colerfull } = this.settings.theme;
    this.context.fillStyle = colerfull === 'background' ? hslColPerc(fps) : bgColor;
    this.context.fillRect(0, 0, width, height);
  }

  private renderText(fps, realFps) {
    const { height, width } = this.settings;
    const { graphPadding } = this.settings.theme;
    const { colerfull, fontSize, textFontSize, font, textColor } = this.settings.theme;
    this.context.fillStyle = textColor;
    const textY = height / 2 - textFontSize / 2;
    const fpsY = height / 2 - fontSize / 2;
    this.context.textAlign = 'left';
    this.context.font = `normal ${textFontSize}px ${font}`;
    this.context.fillText('FPS', graphPadding, textY);
    this.context.fillStyle = colerfull === 'fps' ? hslColPerc(realFps) : this.settings.theme.textColor;
    this.context.textAlign = 'right';
    this.context.font = `normal ${fontSize}px ${font}`;
    this.context.shadowColor = '#000000';
    this.context.shadowBlur = 1;
    this.context.strokeText(fps, width - graphPadding, fpsY);
    this.context.fillText(fps, width - graphPadding, fpsY);
  }

  private renderColumns() {
    const { columnWidth, columnGapSize, height } = this.settings;
    const { columnColor, colerfull, graphPadding } = this.settings.theme;
    this.columnValues.forEach((one, i) => {
      if (!one) {
        return;
      }

      const x = this.columnsLeftGap + columnGapSize + graphPadding + (columnWidth + columnGapSize) * i;
      const value = (height - graphPadding * 2) / 100 * one;
      const y = height - value - graphPadding;

      this.context.fillStyle = colerfull === 'graph' ? hslColPerc(one) : columnColor;
      this.context.fillRect(x, y, this.settings.columnWidth, value);
    });
  }
}
