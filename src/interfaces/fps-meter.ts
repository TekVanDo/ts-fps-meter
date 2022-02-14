export interface FpsMeterConfig {
  width: number;
  height: number;
  columnWidth: number;
  columnGapSize: number;
  minFps: number;
  maxFps: number;
  period: number;
  position: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
  theme: Partial<FpsMeterTheme>;
}

export interface FpsMeterOptions extends Omit<FpsMeterConfig, 'theme'> {
  theme: FpsMeterTheme | 'light' | 'dark' | 'colorful' | 'transparent';
}

export interface FpsMeterTheme {
  textFontSize: number;
  fontSize: number;
  font: string;
  bgColor: string;
  columnColor: string;
  textColor: string;
  colerfull: 'graph' | 'background' | 'fps';
  graphPadding: number;
}
