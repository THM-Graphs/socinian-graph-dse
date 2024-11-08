declare global {
  interface Console {
    success: (...msg: unknown[]) => void;
    warning: (...msg: unknown[]) => void;
  }
}

type ConsoleType = 'success' | 'warning' | 'error' | 'info' | 'debug';

interface Configuration {
  type: ConsoleType;
  color: string;
  signature: string;
}

const CONSOLE_COLORS = {
  RESET: '\x1b[0m',
  ERROR: '\x1b[31m',
  SUCCESS: '\x1b[32m',
  WARNING: '\x1b[33m',
  INFO: '\x1b[34m',
};

const CONFIGURATIONS: Configuration[] = [
  {
    type: 'success',
    color: CONSOLE_COLORS.SUCCESS,
    signature: '✓',
  },
  {
    type: 'warning',
    color: CONSOLE_COLORS.WARNING,
    signature: '?',
  },
  {
    type: 'error',
    color: CONSOLE_COLORS.ERROR,
    signature: '!',
  },
  {
    type: 'info',
    color: CONSOLE_COLORS.INFO,
    signature: 'i',
  },
  {
    type: 'debug',
    color: CONSOLE_COLORS.RESET,
    signature: 'DEBUG',
  },
];

export default class Logger {
  private static debugMode: boolean;

  public static setDebug(debugMode: boolean): void {
    this.debugMode = debugMode;
  }

  public static init(debugMode: boolean = false): void {
    this.setDebug(debugMode);

    for (const config of CONFIGURATIONS) {
      this.initConsole(config);
    }
  }

  private static initConsole(config: Configuration): void {
    console[config.type] = (...args: unknown[]): void => {
      if (config.type === 'debug' && !this.debugMode) return;

      console.log(config.color, `[${this.getTimestamp()}] [${config.signature}] `, ...args, CONSOLE_COLORS.RESET);
    };
  }

  private static getTimestamp(): string {
    const date: Date = new Date();
    return `${date.toLocaleString()}`;
  }
}
