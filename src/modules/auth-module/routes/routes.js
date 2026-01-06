// src/module/auth-module/routes.js

import React from 'https://esm.sh/react@18.2.0';

import Login from './register-login/login.js';
import Register from './register-login/register.js';
import { requireAuth } from './session.js';

export default function Routes(props = {}) {
  const route = props.route || 'login';

  // Public routes
  if (route === 'login') {
    return React.createElement(Login);
  }

  if (route === 'register') {
    return React.createElement(Register);
  }

  // Protected routes
  if (!requireAuth()) {
    return null;
  }

  // Fallback protected view
  return React.createElement(
    'div',
    { style: { padding: '40px' } },
    React.createElement('h2', null, 'Authenticated Area'),
    React.createElement('p', null, 'You are logged in.')
  );
}
