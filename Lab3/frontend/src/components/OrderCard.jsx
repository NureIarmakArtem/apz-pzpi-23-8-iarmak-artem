import { useTranslation } from 'react-i18next';

const OrderCard = ({ order, onComplete }) => {
  const { t } = useTranslation();

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '15px' }}>
      <h3 style={{ marginBottom: '10px' }}>{t('order_number')}{order.id}</h3>
      <p style={{ marginBottom: '5px' }}><strong>{t('address')}:</strong> {order.clientAddress}</p>
      <p style={{ marginBottom: '15px' }}><strong>{t('status')}:</strong> {order.status}</p>
      
      <button 
        onClick={() => onComplete(order.id)}
        style={{ width: '100%', padding: '10px', background: '#6200EE', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {t('complete_order')}
      </button>
    </div>
  );
};

export default OrderCard;