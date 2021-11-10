declare namespace Common {
  interface IRC {
    [key: string]: string | number;
  }

  interface VersionInfo {
    latest: string;
    current: string;
  }

  type LogType = 'log' | 'info' | 'warn' | 'error';

  interface PkgVersion extends Record<string, string> {
    major: string;
    minor: string;
    patch: string;
    premajor: string;
    preminor: string;
    prepatch: string;
    prerelease: string;
  }
  interface CmdOp {
    cmd: string;
    alias: string;
    desc: string;
    action: (
      args?: string[],
      ops?: Record<string, boolean>
    ) => void | Promise<void>;
    options?: [string, string];
    argsLen?: number;
    examples: string[];
  }
  type CmdOps = CmdOp[];
}
