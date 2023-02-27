export const timestampFunc = (): string => new Date().toISOString();

export const calcExecutionTime = (start: number, end: number): number =>
  end - start;
