import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';
import OrderCard from '../components/OrderCard';

const Dashboard = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const courierId = localStorage.getItem('courierId');

  const fetchOrders = async () => {
    if (!courierId) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(`/orders/my?courierId=${courierId}`);
      
      const adaptedOrders = response.data.map(order => ({
        ...order,
        clientAddress: order.client_address 
      }));
      
      setOrders(adaptedOrders);
    } catch (error) {
      console.error("Помилка завантаження замовлень", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (newStatus) => {
    if (!newStatus && orders.length > 0) {
      alert("У вас є незавершене замовлення! Доставте його, перш ніж переходити в Офлайн.");
      return;
    }

    try {
      const dbStatus = newStatus ? 'active' : 'offline'; 
      await axiosClient.patch(`/couriers/status`, {
        courierId: courierId,
        status: dbStatus
      });
      
      setIsOnline(newStatus);

      if (!newStatus) {
        setOrders([]); 
      }
    } catch (error) {
      const serverError = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Помилка сервера: ${serverError}`);
    }
  };

  useEffect(() => {
    const checkCurrentStatus = async () => {
      if (!courierId) return;
      try {
        const response = await axiosClient.get(`/couriers/${courierId}`);
        const currentStatus = response.data.status;
        
        if (currentStatus === 'active' || currentStatus === 'busy') {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.error("Не удалось подтянуть status при загрузке", error);
      }
    };

    checkCurrentStatus();
  }, [courierId]);

  useEffect(() => {
    if (isOnline) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [isOnline]);

  const handleCompleteOrder = async (orderId) => {
    try {
      await axiosClient.patch(`/orders/${orderId}/status`, {
        status: 'completed',
        courierLat: 50.00,
        courierLon: 36.23
      });
      
      alert(t('success_delivery'));
      fetchOrders();
    } catch (error) {
      alert(`Помилка: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
          {isOnline ? <span style={{ color: 'green' }}>● {t('status_online')}</span> : <span style={{ color: 'gray' }}>● {t('status_offline')}</span>}
        </span>
        
        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
          <input 
            type="checkbox" 
            checked={isOnline} 
            onChange={(e) => handleToggleStatus(e.target.checked)} 
            style={{ opacity: 0, width: 0, height: 0 }} 
          />
          <span style={{ 
            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: isOnline ? '#73d13d' : '#ccc', transition: '.4s', borderRadius: '24px' 
          }}>
            <span style={{
              position: 'absolute', content: '""', height: '18px', width: '18px', left: isOnline ? '28px' : '3px', bottom: '3px',
              backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
            }}></span>
          </span>
        </label>
      </div>

      <h2>{t('my_orders')}</h2>
      <div style={{ marginTop: '15px' }}>
        {!isOnline && <p style={{ color: 'gray' }}>{t('turn_on_online_msg')}</p>}
        {isOnline && loading && <p>Завантаження...</p>}
        {isOnline && !loading && orders.length === 0 && <p>{t('no_orders')}</p>}
        
        {isOnline && !loading && orders.map(order => (
          <OrderCard key={order.id} order={order} onComplete={handleCompleteOrder} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;