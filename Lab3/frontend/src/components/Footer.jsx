import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer style={{ background: '#eef0f4', color: '#333', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #dcdcdc' }}>
      <div style={{ fontSize: '16px' }}>Delivery System</div>
      <div style={{ fontSize: '16px', cursor: 'pointer' }}>{t('privacy')}</div>
    </footer>
  );
};

export default Footer;