// Damit bekommt man beim Zugriff auf process.env automatisch IntelliSense + Typprüfung

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;

    // PostgreSQL Config
    PGUSER?: string;
    PGPASSWORD?: string;
    PGHOST?: string;
    PGPORT?: string;
    PGDATABASE?: string;
    PGDATABASE_TEST?: string;

    // JWT
    JWT_SECRET?: string;

    //Database
    DATABASE_URL?: string;
  }
}
