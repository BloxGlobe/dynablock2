// src/module/auth-module/register-login/login.js

import React from 'https://esm.sh/react@18.2.0';
import { authAPI } from '../auth.js';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const result = await authAPI.login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    window.dispatchEvent(new CustomEvent('session:login', {
      detail: {
        user: result.user,
        token: result.token,
        rememberMe: true
      }
    }));

    if (window.navigateToPage) {
      window.navigateToPage('dashboard');
    }
  }

  return React.createElement(
    'form',
    { onSubmit: handleSubmit, style: { maxWidth: '400px', margin: '40px auto' } },
    React.createElement('h2', null, 'Login'),
    error && React.createElement('p', { style: { color: 'red' } }, error),
    React.createElement('input', {
      placeholder: 'Email',
      value: email,
      onChange: e => setEmail(e.target.value)
    }),
    React.createElement('input', {
      type: 'password',
      placeholder: 'Password',
      value: password,
      onChange: e => setPassword(e.target.value)
    }),
    React.createElement('button', { type: 'submit' }, 'Login')
  );
}
