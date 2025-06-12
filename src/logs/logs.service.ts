import { appendFile } from 'fs/promises';

export class LogsService {
  async logToFile(logs: string, clientIp: string) {
    const logMess = `[${new Date().toISOString()}] [${clientIp}] ${logs}\n`;
    await appendFile('./src/logs/logs.txt', logMess);
  }
}