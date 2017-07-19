import {
    Writable, 
    Readable,
}               from "stream";

declare module "python-bridge" {
  interface pythonBridge extends Function {
      (option?: PythonBridgeOptions): PythonBridge;
  }
  export const pythonBridge: pythonBridge

  export interface PythonBridgeOptions {
    intepreter: string;
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
    stdin: Writable;
    stdout: Readable;
    stderr: Readable;
    connected: boolean;
  }

  export function isPythonException(e: any): boolean;

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
  export type PipeStdin = Pipe | Readable;
  export type PipeStdout = Pipe | Writable;
  export type PipeStderr = Pipe | Writable;
}
