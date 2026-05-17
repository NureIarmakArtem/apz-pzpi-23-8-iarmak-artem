import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosClient.post('/auth/login', { login, password });
      
      const user = response.data.user;
      
      // Зберігаємо загальні дані
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('courierId', user?.id);
      localStorage.setItem('role', user?.role); // Зберігаємо роль на всякий випадок
      
      // РОЗПОДІЛ ТРАФІКУ:
      if (user?.role === 'admin') {
        navigate('/admin'); // Адміна кидаємо ТІЛЬКИ в адмінку
      } else {
        navigate('/'); // Кур'єра кидаємо ТІЛЬКИ на екран замовлень
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError(t('error_auth'));
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
      <h2>{t('login_title')}</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          style={{ padding: '10px' }} 
          placeholder={t('username')} 
          value={login} 
          onChange={e => setLogin(e.target.value)} 
          required 
        />
        <input 
          style={{ padding: '10px' }} 
          type="password" 
          placeholder={t('password')} 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button style={{ padding: '10px', background: '#6200EE', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }} type="submit">
          {t('sign_in')}
        </button>
      </form>
    </div>
  );
};

export default Login;