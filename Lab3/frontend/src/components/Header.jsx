import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      background: '#001529',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>
        DELIVERY SYSTEM
      </div>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => i18n.changeLanguage('ua')} 
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            UA
          </button>
          <span>|</span>
          <button 
            onClick={() => i18n.changeLanguage('en')} 
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            EN
          </button>
        </div>

        {token && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', background: '#52c41a' 
            }}></div>
            <button 
              onClick={handleLogout} 
              style={{ background: 'none', color: '#ff4d4f', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {t('logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;