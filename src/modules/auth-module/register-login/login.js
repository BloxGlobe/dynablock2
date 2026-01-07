
import { authAPI } from '../auth.js';

export function createLoginForm() {
  const container = document.createElement('div');
  container.style.cssText = `
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  const form = document.createElement('form');
  form.style.cssText = `
    max-width: 420px;
    width: 100%;
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  `;

  const banner = window.authImageSrc 
    ? `<img src="${window.authImageSrc}" alt="auth banner" style="width:80px;height:80px;border-radius:50%;display:block;margin:12px auto">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);margin:12px auto;display:flex;align-items:center;justify-content:center;font-size:32px">👋</div>`;

  form.innerHTML = `
    ${banner}
    <h2 style="text-align:center;margin-bottom:8px;font-size:28px;font-weight:700">Welcome Back</h2>
    <p style="text-align:center;margin-top:0;margin-bottom:24px;color:#666;font-size:14px">Sign in to your account</p>
    
    <div id="error" style="display:none;padding:12px;background:#fee;color:#c33;border-radius:8px;margin-bottom:16px;font-size:14px"></div>
    
    <input type="email" id="email" placeholder="Email" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:15px;box-sizing:border-box">
    
    <input type="password" id="password" placeholder="Password" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:15px;box-sizing:border-box">
    
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:13px">
      <label style="display:flex;align-items:center;cursor:pointer">
        <input type="checkbox" id="remember" style="margin-right:6px"> Remember me
      </label>
      <a href="#forgot" id="forgot-link" style="color:#3b82f6;text-decoration:none;font-weight:500">Forgot password?</a>
    </div>
    
    <button type="submit" id="submit-btn" style="margin-top:20px;width:100%;padding:14px;border-radius:10px;background:linear-gradient(90deg,#3b82f6,#7c3aed);color:#fff;border:none;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s">
      Sign In
    </button>
    
    <p style="text-align:center;margin-top:16px;color:#666;font-size:14px">
      Don't have an account? 
      <a href="#register" id="register-link" style="color:#3b82f6;font-weight:600;text-decoration:none">Sign Up</a>
    </p>
  `;

  const errorDiv = form.querySelector('#error');
  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');
  const rememberCheck = form.querySelector('#remember');
  const submitBtn = form.querySelector('#submit-btn');

  form.querySelector('#forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset coming soon!');
  });

  form.querySelector('#register-link').addEventListener('click', (e) => {
    e.preventDefault();
    if (window.navigateToPage) window.navigateToPage('register');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberCheck.checked;

    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (!email || !password) {
      errorDiv.textContent = 'Email and password are required';
      errorDiv.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';
    submitBtn.style.background = '#ccc';
    submitBtn.style.cursor = 'not-allowed';

    try {
      const result = await authAPI.login(email, password);

      if (!result.success) {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
        submitBtn.style.background = 'linear-gradient(90deg,#3b82f6,#7c3aed)';
        submitBtn.style.cursor = 'pointer';
        return;
      }

      window.dispatchEvent(new CustomEvent('session:login', {
        detail: { user: result.user, token: result.token, rememberMe }
      }));

      if (window.navigateToPage) window.navigateToPage('dashboard');
    } catch (err) {
      errorDiv.textContent = 'An error occurred. Please try again.';
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
      submitBtn.style.background = 'linear-gradient(90deg,#3b82f6,#7c3aed)';
      submitBtn.style.cursor = 'pointer';
    }
  });

  container.appendChild(form);
  return container;
}