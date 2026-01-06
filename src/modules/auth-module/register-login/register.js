// src/module/auth-module/register-login/register.js

import React from 'https://esm.sh/react@18.2.0';
import { authAPI } from '../auth.js';

export default function Register() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const result = await authAPI.register(username, email, password);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage('Registration successful. Please log in.');

    if (window.navigateToPage) {
      window.navigateToPage('login');
    }
  }

  return React.createElement(
    'form',
    { onSubmit: handleSubmit, style: { maxWidth: '400px', margin: '40px auto' } },
    React.createElement('h2', null, 'Register'),
    message && React.createElement('p', null, message),
    React.createElement('input', {
      placeholder: 'Username',
      value: username,
      onChange: e => setUsername(e.target.value)
    }),
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
    React.createElement('button', { type: 'submit' }, 'Register')
  );
}
