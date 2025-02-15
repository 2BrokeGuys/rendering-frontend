const TABLE_QUERIES = {
  CREATE_TABLE_IF_NOT_EXISTS_USERS: `
          CREATE TABLE IF NOT EXISTS users (
              user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              username VARCHAR(26) NOT NULL UNIQUE,
              email VARCHAR(100) NOT NULL UNIQUE,
              password TEXT NOT NULL
          );`,
  CREATE_TABLE_IF_NOT_EXISTS_REFRESH_TOKENS: `
            CREATE TABLE IF NOT EXISTS refresh_tokens (
              user_id UUID NOT NULL,
              token TEXT NOT NULL,
              PRIMARY KEY (user_id, token),
              FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );`
};

export default TABLE_QUERIES;
