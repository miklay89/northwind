/* eslint-disable no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_DATABASE_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    LIMIT: number;
  }
}
