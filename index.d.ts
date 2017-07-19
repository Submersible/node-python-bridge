// declare module "python-bridge" {
  interface pythonBridge extends Function {
      (options?: PythonBridgeOptions): PythonBridge;
  }

  export const pythonBridge: pythonBridge

  export interface PythonBridgeOptions {
    intepreter?: string;
    stdio?: [PipeStdin, PipeStdout, PipeStderr];
    cwd?: string;
    env?: { [key:string]: string; };
    uid?: number;
    gid?: number;
  }

  export interface PythonBridge {
    (literals: TemplateStringsArray | string, ...placeholders: any[]): Promise<any>;
    ex(literals: TemplateStringsArray | string, ...placeholders: any[]): Promise<void>;
    lock<T>(withLock: (python: PythonBridge) => Promise<T>): Promise<T>
    pid: number;
    end(): Promise<void>;  
    disconnect(): Promise<void>;
    kill(signal: string | number): void;
    stdin: NodeJS.WritableStream;
    stdout: NodeJS.ReadableStream;
    stderr: NodeJS.ReadableStream;
    connected: boolean;
  }

  export function isPythonException(name: string): (e: any) => boolean;
  export function isPythonException(name: string, e: any): boolean;

  export class PythonException extends Error {
    exception: {
      message: string;
      args: any[];
      type: { name: string; module: string; }
      format: string[];
    };
    traceback: {
      lineno: number;
      strack: string[];
      format: string[]
    };
    format: string[]
  }

  export type Pipe = "pipe" | "ignore" | "inherit";
  export type PipeStdin = Pipe | NodeJS.ReadableStream;
  export type PipeStdout = Pipe | NodeJS.WritableStream;
  export type PipeStderr = Pipe | NodeJS.WritableStream;
// }