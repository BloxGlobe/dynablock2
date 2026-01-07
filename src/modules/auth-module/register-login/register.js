


export function createRegisterForm() {
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
    : `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#f5eaff,#e9d5ff);margin:12px auto;display:flex;align-items:center;justify-content:center;font-size:32px">🚀</div>`;

  form.innerHTML = `
    ${banner}
    <h2 style="text-align:center;margin-bottom:8px;font-size:28px;font-weight:700">Create Account</h2>
    <p style="text-align:center;margin-top:0;margin-bottom:24px;color:#666;font-size:14px">Sign up to get started</p>
    
    <div id="error" style="display:none;padding:12px;background:#fee;color:#c33;border-radius:8px;margin-bottom:16px;font-size:14px"></div>
    
    <div id="success" style="display:none;padding:12px;background:#efe;color:#0a0;border-radius:8px;margin-bottom:16px;font-size:14px"></div>
    
    <input type="text" id="username" placeholder="Username" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:15px;box-sizing:border-box">
    
    <input type="email" id="email" placeholder="Email" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:15px;box-sizing:border-box">
    
    <input type="password" id="password" placeholder="Password" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:15px;box-sizing:border-box">
    
    <input type="password" id="confirm" placeholder="Confirm Password" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:15px;box-sizing:border-box">
    
    <button type="submit" id="submit-btn" style="margin-top:16px;width:100%;padding:14px;border-radius:10px;background:linear-gradient(90deg,#d946ef,#f472b6);color:#fff;border:none;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s">
      Sign Up
    </button>
    
    <p style="text-align:center;margin-top:16px;color:#666;font-size:14px">
      Already have an account? 
      <a href="#login" id="login-link" style="color:#d946ef;font-weight:600;text-decoration:none">Sign In</a>
    </p>
  `;

  const errorDiv = form.querySelector('#error');
  const successDiv = form.querySelector('#success');
  const usernameInput = form.querySelector('#username');
  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');
  const confirmInput = form.querySelector('#confirm');
  const submitBtn = form.querySelector('#submit-btn');

  form.querySelector('#login-link').addEventListener('click', (e) => {
    e.preventDefault();
    if (window.navigateToPage) window.navigateToPage('login');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    errorDiv.textContent = '';
    successDiv.textContent = '';

    if (!username || !email || !password || !confirm) {
      errorDiv.textContent = 'All fields are required';
      errorDiv.style.display = 'block';
      return;
    }

    if (username.length < 3) {
      errorDiv.textContent = 'Username must be at least 3 characters';
      errorDiv.style.display = 'block';
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = 'Password must be at least 6 characters';
      errorDiv.style.display = 'block';
      return;
    }

    if (password !== confirm) {
      errorDiv.textContent = 'Passwords do not match';
      errorDiv.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.style.background = '#ccc';
    submitBtn.style.cursor = 'not-allowed';

    try {
      const result = await authAPI.register(username, email, password);

      if (!result.success) {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
        submitBtn.style.background = 'linear-gradient(90deg,#d946ef,#f472b6)';
        submitBtn.style.cursor = 'pointer';
        return;
      }

      successDiv.textContent = 'Registration successful! Redirecting to login...';
      successDiv.style.display = 'block';

      setTimeout(() => {
        if (window.navigateToPage) window.navigateToPage('login');
      }, 2000);
    } catch (err) {
      errorDiv.textContent = 'An error occurred. Please try again.';
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
      submitBtn.style.background = 'linear-gradient(90deg,#d946ef,#f472b6)';
      submitBtn.style.cursor = 'pointer';
    }
  });

  container.appendChild(form);
  return container;
}