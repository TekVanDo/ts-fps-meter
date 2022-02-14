import { FpsMeterTheme } from '../interfaces/fps-meter';

export const baseTheme:FpsMeterTheme = {
  graphPadding: 5,
  bgColor: 'rgb(34, 34, 34)',
  columnColor: '#3f3f3f',
  textColor: '#ffffff',
  colerfull: null,
  font: 'Consolas, "Andale Mono", monospace',
  textFontSize: 12,
  fontSize: 24,
};

export const themes: { [key: string]: Partial<FpsMeterTheme> } = {
  dark: {
    bgColor: 'rgb(34, 34, 34)',
    columnColor: '#3f3f3f',
    textColor: '#ffffff',
    colerfull: 'fps',
  },
  light: {
    bgColor: '#fff',
    columnColor: '#eaeaea',
    textColor: '#666',
    colerfull: 'fps',
  },
  colorful: {
    columnColor: '#777',
    textColor: '#888',
    colerfull: 'background',
  },
  transparent: {
    colerfull: 'graph',
    graphPadding: 5,
    textColor: '#fff',
    bgColor: null,
  }
};
