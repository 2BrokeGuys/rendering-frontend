import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import validator from 'validator';
import { compare, hash } from 'bcrypt';
import { TOKEN_QUERIES, USER_QUERIES } from '../queries/auth';
import { generateJsonWebToken } from '../utils/auth';

const {
  GET_USERS_BY_USERNAME_OR_EMAIL,
  GET_USER_BY_USERNAME_OR_EMAIL,
  CREATE_NEW_USER,
  DELETE_REFRESH_TOKEN
} = USER_QUERIES;

const { CREATE_NEW_REFRESH_TOKEN, GET_USER_BY_REFRESH_TOKEN } = TOKEN_QUERIES;

const signupController: RequestHandler = async (request, response) => {
  const { email, username, password } = request.body;

  if (!email || !username || !password) {
    response
      .status(400)
      .json({ message: 'Email, Username and password are required' });
    return;
  }

  if (!validator.isEmail(email)) {
    response.status(400).json({ message: 'Invalid email format.' });
    return;
  }

  if (!/^[a-zA-Z0-9_]{3,26}$/.test(username)) {
    response.status(400).json({
      message:
        'Username must be 3-26 characters long and contain only letters, numbers, and underscores.'
    });
    return;
  }

  if (password.length < 8) {
    response
      .status(400)
      .json({ message: 'Password must be of at least 8 characters.' });
    return;
  }

  try {
    const queryResult = await pool.query(GET_USERS_BY_USERNAME_OR_EMAIL, [
      username,
      email
    ]);

    if (queryResult.rows.length > 0) {
      const existingUser = queryResult.rows[0];
      if (existingUser.email === email) {
        response.status(409).json({ message: 'Email is already in use!' });
      } else if (existingUser.username === username) {
        response.status(409).json({ message: 'Username is already taken!' });
      }
      return;
    }

    const hashedPassword = await hash(password, 10);
    await pool.query(CREATE_NEW_USER, [username, email, hashedPassword]);
    response.sendStatus(201);
  } catch (error) {
    response.status(500).send({ error: 'There was an error while signing up' });
  }
};

const signinController: RequestHandler = async (request, response) => {
  const { email, username, password } = request.body;

  if (!email && !username) {
    response.status(400).json({ message: 'Email/Username is required' });
    return;
  }

  if (!password) {
    response.status(400).json({ message: 'Password is required' });
    return;
  }

  try {
    const queryResult = await pool.query(GET_USER_BY_USERNAME_OR_EMAIL, [
      username || null,
      email || null
    ]);

    if (queryResult.rows.length == 0) {
      response.status(401).json({ message: 'Invalid Email/Username' });
      return;
    }

    const user = queryResult.rows[0];
    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      response.status(401).json({ message: 'Invalid Password' });
      return;
    }

    const payload = {
      id: user.user_id,
      email: user.email,
      username: user.username
    };

    const accessToken = generateJsonWebToken({ user: payload, isAccess: true });
    const refreshToken = generateJsonWebToken({
      user: payload,
      isAccess: false
    });

    await pool.query(CREATE_NEW_REFRESH_TOKEN, [user.user_id, refreshToken]);

    response
      .cookie('access', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })
      .cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .sendStatus(200);
  } catch (error) {
    response.status(500).send({ error: 'There was an error while signing in' });
  }
};

const refreshAccessTokenController: RequestHandler = async (
  request,
  response
) => {
  const refreshToken = request.cookies['refresh'];

  if (!refreshToken) {
    response.status(400).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    const queryResult = await pool.query(GET_USER_BY_REFRESH_TOKEN, [
      refreshToken
    ]);

    if (queryResult.rows.length === 0) {
      response.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          response.status(403).json({ message: 'Invalid refresh token' });
          return;
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id, email: decoded.email },
          process.env.JWT_ACCESS_TOKEN_SECRET as string,
          { expiresIn: '15m' }
        );

        response
          .cookie('access', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
          })
          .sendStatus(200);
      }
    );
  } catch (error) {
    response
      .status(500)
      .send({ error: 'There was an error refreshing your access token' });
  }
};

const logoutController: RequestHandler = async (request, response) => {
  const refreshToken = request.cookies['refresh'];

  if (!refreshToken) {
    response.status(400).send({ error: 'Refresh token is required.' });
    return;
  }

  try {
    await pool.query(DELETE_REFRESH_TOKEN, [refreshToken]);
    response.clearCookie('access').clearCookie('refresh').sendStatus(204);
  } catch (error) {
    response.status(500).send({ error: 'There was an error logging you out' });
  }
};
export {
  signupController,
  signinController,
  refreshAccessTokenController,
  logoutController
};
