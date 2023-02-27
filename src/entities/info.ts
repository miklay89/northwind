/* eslint-disable lines-between-class-members */
export default class Info {
  query: string;
  timestamp: string;
  executionTime: number;
  workerId: string;

  constructor(
    query: string,
    timestamp: string,
    executionTime: number,
    workerId: string,
  ) {
    this.query = query;
    this.timestamp = timestamp;
    this.executionTime = executionTime;
    this.workerId = workerId;
  }
}
