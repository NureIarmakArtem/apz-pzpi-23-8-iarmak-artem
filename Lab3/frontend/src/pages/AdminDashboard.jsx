import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('couriers');
  
  const [couriers, setCouriers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [newCourier, setNewCourier] = useState({ login: '', password: '', fullName: '', phone: '' });
  const [newOrderAddr, setNewOrderAddr] = useState('');
  const [assignData, setAssignData] = useState({ orderId: '', courierId: '' });

  const fetchCouriers = async () => {
    try { 
      const res = await axiosClient.get('/couriers'); 
      console.log("ОТВЕТ СЕРВЕРА ПО КУРЬЕРАМ:", res.data); 
      setCouriers(res.data); 
    } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
    try { const res = await axiosClient.get('/orders'); setOrders(res.data); } 
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === 'couriers') await fetchCouriers();
      if (activeTab === 'orders') { await fetchOrders(); await fetchCouriers(); } 
    };
    loadData();
  }, [activeTab]);

  const handleRegisterCourier = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/auth/register', { ...newCourier, role: 'courier' });
      alert(t('courier_registered_success'));
      setNewCourier({ login: '', password: '', fullName: '', phone: '' });
      fetchCouriers();
    } catch (e) { alert(t('error') + ': ' + (e.response?.data?.message || e.message)); }
  };

  const handleDeleteCourier = async (id) => {
    if (!window.confirm(t('confirm_fire'))) return;
    try {
      await axiosClient.delete(`/couriers/${id}`);
      fetchCouriers();
    } catch (e) { alert(t('error')); }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/orders', { clientAddress: newOrderAddr });
      setNewOrderAddr('');
      fetchOrders();
    } catch (e) { alert(t('error') + ': ' + (e.response?.data?.error || e.message)); }
  };

  const handleAssignOrder = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.patch(`/orders/${assignData.orderId}/assign`, { courierId: assignData.courierId });
      alert(t('order_assigned_success'));
      
      fetchOrders();
      fetchCouriers();
      
    } catch (e) { alert(t('error') + ': ' + (e.response?.data?.message || e.response?.data?.error || e.message)); }
  };

  const handleSystemAction = async (actionPath) => {
    try {
      const res = await axiosClient[actionPath.includes('backup') ? 'post' : 'get'](`/admin/${actionPath}`);
      alert(t('success') + ': ' + JSON.stringify(res.data));
    } catch (e) { 
      alert(t('error') + ': ' + (e.response?.data?.error || e.response?.data?.message || e.message)); 
    }
  };

  const styles = {
    container: { padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif', color: '#333' },
    card: { background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' },
    title: { marginTop: 0, marginBottom: '20px', fontSize: '24px', color: '#001529' },
    subtitle: { fontSize: '18px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' },
    formGroup: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' },
    input: { padding: '10px 15px', border: '1px solid #d9d9d9', borderRadius: '6px', outline: 'none', flex: 1, minWidth: '200px' },
    select: { padding: '10px 15px', border: '1px solid #d9d9d9', borderRadius: '6px', outline: 'none', flex: 1, minWidth: '200px', background: '#fff' },
    btnPrimary: { background: '#1677ff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
    btnDanger: { background: '#ff4d4f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnSuccess: { background: '#52c41a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { background: '#fafafa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #f0f0f0' },
    td: { padding: '12px', borderBottom: '1px solid #f0f0f0' },
    badgeActive: { background: '#f6ffed', color: '#389e0d', border: '1px solid #b7eb8f', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    badgeOffline: { background: '#f5f5f5', color: '#595959', border: '1px solid #d9d9d9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    badgeBusy: { background: '#fff7e6', color: '#d46b08', border: '1px solid #ffd591', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
  };

  const tabStyle = (tabName) => ({
    padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
    borderBottom: activeTab === tabName ? '3px solid #1677ff' : '3px solid transparent',
    color: activeTab === tabName ? '#1677ff' : '#8c8c8c', transition: '0.3s'
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{t('admin_panel')}</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #d9d9d9' }}>
        <div style={tabStyle('couriers')} onClick={() => setActiveTab('couriers')}>{t('tab_couriers')}</div>
        <div style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>{t('tab_orders')}</div>
        <div style={tabStyle('system')} onClick={() => setActiveTab('system')}>{t('tab_system')}</div>
      </div>

      {activeTab === 'couriers' && (
        <div style={styles.card}>
          <h3 style={styles.subtitle}>{t('register_courier')}</h3>
          <form onSubmit={handleRegisterCourier} style={styles.formGroup}>
            <input placeholder={t('username')} required value={newCourier.login} onChange={e => setNewCourier({...newCourier, login: e.target.value})} style={styles.input} />
            <input placeholder={t('password')} type="password" required value={newCourier.password} onChange={e => setNewCourier({...newCourier, password: e.target.value})} style={styles.input} />
            <input placeholder={t('full_name')} required value={newCourier.fullName} onChange={e => setNewCourier({...newCourier, fullName: e.target.value})} style={styles.input} />
            <input placeholder={t('phone')} required value={newCourier.phone} onChange={e => setNewCourier({...newCourier, phone: e.target.value})} style={styles.input} />
            <button type="submit" style={styles.btnPrimary}>{t('create_btn')}</button>
          </form>

          <h3 style={styles.subtitle}>{t('couriers_list')}</h3>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>ID</th><th style={styles.th}>{t('full_name')}</th><th style={styles.th}>{t('phone')}</th><th style={styles.th}>{t('status')}</th><th style={styles.th}>{t('actions')}</th></tr></thead>
            <tbody>
              {couriers.map(c => (
                <tr key={c.user_id || c.id}>
                  <td style={styles.td}>{c.user_id || c.id}</td>
                  <td style={styles.td}>{c.full_name}</td>
                  <td style={styles.td}>{c.phone || c.phone_number || c.phoneNumber || '—'}</td>
                  <td style={styles.td}>
                    <span style={c.status === 'active' ? styles.badgeActive : c.status === 'busy' ? styles.badgeBusy : styles.badgeOffline}>
                      {c.status ? c.status.toUpperCase() : 'OFFLINE'}
                    </span>
                  </td>
                  <td style={styles.td}><button onClick={() => handleDeleteCourier(c.user_id || c.id)} style={styles.btnDanger}>{t('fire_btn')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <>
          <div style={styles.card}>
            <h3 style={styles.subtitle}>{t('create_order')}</h3>
            <form onSubmit={handleCreateOrder} style={styles.formGroup}>
              <input placeholder={t('client_address_placeholder')} required value={newOrderAddr} onChange={e => setNewOrderAddr(e.target.value)} style={styles.input} />
              <button type="submit" style={styles.btnPrimary}>{t('add_to_db_btn')}</button>
            </form>
          </div>

          <div style={styles.card}>
            <h3 style={styles.subtitle}>{t('assign_order')}</h3>
            <form onSubmit={handleAssignOrder} style={styles.formGroup}>
              <select required value={assignData.orderId} onChange={e => setAssignData({...assignData, orderId: e.target.value})} style={styles.select}>
                <option value="">-- {t('select_order')} --</option>
                {orders.filter(o => o.status === 'new').map(o => <option key={o.id} value={o.id}>ID {o.id} - {o.client_address}</option>)}
              </select>
              <select required value={assignData.courierId} onChange={e => setAssignData({...assignData, courierId: e.target.value})} style={styles.select}>
                <option value="">-- {t('select_courier')} --</option>
                {couriers.filter(c => c.status === 'active').map(c => <option key={c.id || c.user_id} value={c.id || c.user_id}>{c.full_name}</option>)}
              </select>
              <button type="submit" style={styles.btnPrimary}>{t('assign_btn')}</button>
            </form>
          </div>

          <div style={styles.card}>
            <h3 style={styles.subtitle}>{t('all_orders')}</h3>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>ID</th><th style={styles.th}>{t('address')}</th><th style={styles.th}>{t('status')}</th><th style={styles.th}>ID {t('tab_couriers')}</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={styles.td}>{o.id}</td><td style={styles.td}>{o.client_address}</td>
                    <td style={styles.td}><b>{o.status}</b></td><td style={styles.td}>{o.courier_id || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'system' && (
        <div style={styles.card}>
          <h3 style={styles.subtitle}>{t('system_management')}</h3>
          <div style={styles.formGroup}>
            <button onClick={() => handleSystemAction('export?type=couriers')} style={styles.btnPrimary}>{t('export_couriers')}</button>
            <button onClick={() => handleSystemAction('export?type=orders')} style={styles.btnPrimary}>{t('export_orders')}</button>
            <button onClick={() => handleSystemAction('backup')} style={styles.btnSuccess}>{t('create_backup')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;