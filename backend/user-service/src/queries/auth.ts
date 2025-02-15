const USER_QUERIES = {
  GET_USERS_BY_USERNAME_OR_EMAIL: `SELECT username, email FROM users WHERE username = $1 OR email = $2`,
  GET_USER_BY_USERNAME_OR_EMAIL: `SELECT user_id, username, email, password FROM users WHERE username = $1 OR email = $2`,
  CREATE_NEW_USER: `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
  DELETE_REFRESH_TOKEN: `DELETE FROM refresh_tokens WHERE token = $1`
};

const TOKEN_QUERIES = {
  CREATE_NEW_REFRESH_TOKEN: `INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)`,
  GET_USER_BY_REFRESH_TOKEN: `SELECT user_id FROM refresh_tokens WHERE token = $1`
};

export { USER_QUERIES, TOKEN_QUERIES };
