import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

function SellerProfile() {
  const { isUserLoggedIn, displayName, profilePicture, userId } = useAppAuth();
  const location = useLocation();

  const [storeStatus, setStoreStatus] = useState('loading');
  const [storeSetupData, setStoreSetupData] = useState({ nume: displayName || '', adresa: '' });
  const [storeLogo, setStoreLogo] = useState(null);

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [myOffers, setMyOffers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [formData, setFormData] = useState({
    produs: '',
    magazin: '',
    pret_lei: '',
    numar_valabil: '',
    adresa: '',
    tag: '',
    reducere: '',
    ridicare: '',
    comanda: '',
    descriere: '',
    ingrediente: ''
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (isUserLoggedIn && userId) {
      checkStoreStatus();
    }
  }, [isUserLoggedIn, userId]);

  useEffect(() => {
    if (location.state?.editOffer) {
      const offer = location.state.editOffer;
      setEditId(offer._id);
      setFormData({
        produs: offer.produs || '',
        magazin: offer.magazin || '',
        pret_lei: offer.pret_lei || '',
        numar_valabil: offer.numar_valabil || '',
        adresa: offer.adresa || '',
        tag: offer.tag || '',
        reducere: offer.reducere || '',
        ridicare: offer.ridicare || '',
        comanda: offer.comanda || '',
        descriere: offer.descriere || '',
        ingrediente: offer.ingrediente || ''
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  const checkStoreStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/shop/${displayName}`);
      if (response.ok) {
        const data = await response.json();
        const magazinName = data.shop.numeMagazin;
        const magazinAdresa = data.shop.adresa;

        setFormData(prev => ({ ...prev, magazin: magazinName, adresa: magazinAdresa }));
        setStoreStatus('ready');
        fetchMyOffers(magazinName);
      } else {
        setStoreStatus('needs setup');
      }
    } catch (error) {
      setStoreStatus('needs setup');
    }
  };

  const fetchMyOffers = async (storeName) => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter(p => p.magazin && p.magazin.toLowerCase() === (storeName || displayName).toLowerCase());
        setMyOffers(filtered);
      }
    } catch (error) {
      setStatusMessage('a aparut o eroare la incarcarea ofertelor');
    }
  };

  const handleStoreSetupChange = (e) => {
    const { name, value } = e.target;
    setStoreSetupData(prev => ({ ...prev, [name]: value }));
  };

  const handleStoreSetupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('se inregistreaza magazinul');

    try {
      const data = new FormData();
      data.append('numeMagazin', storeSetupData.nume);
      data.append('adresa', storeSetupData.adresa);
      if (storeLogo) data.append('image', storeLogo);

      const response = await fetch('http://localhost:3000/api/shop', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        setFormData(prev => ({ ...prev, magazin: storeSetupData.nume, adresa: storeSetupData.adresa }));
        setStoreStatus('ready');
        fetchMyOffers(storeSetupData.nume);
        toast.success('magazinul a fost inregistrat cu succes', { id: loadingToast });
      } else {
        const errData = await response.json().catch(() => null);
        toast.error(`eroare backend: ${errData?.error || response.statusText}`, { id: loadingToast });
      }
    } catch (error) {
      toast.error('eroare de retea. asigura-te ca serverul functioneaza', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading(editId ? 'se actualizeaza oferta..' : 'se publica oferta..');

    try {
      let response;

      if (editId) {
        response = await fetch(`http://localhost:3000/api/products/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      } else {
        const data = new FormData();
        for (const key in formData) {
          data.append(key, formData[key]);
        }
        if (imageFile) {
          data.append('image', imageFile);
        }
        response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          body: data,
        });
      }

      if (response.ok) {
        toast.success(editId ? 'oferta a fost actualizata' : 'oferta a fost publicata cu succes', { id: loadingToast });

        const savedMagazin = formData.magazin;
        const savedAdresa = formData.adresa;
        setFormData({
          produs: '', magazin: savedMagazin, pret_lei: '', numar_valabil: '',
          adresa: savedAdresa, tag: '', reducere: '', ridicare: '', comanda: '', descriere: '', ingrediente: ''
        });
        setImageFile(null);
        setEditId(null);
        e.target.reset();
        fetchMyOffers(savedMagazin);
      } else {
        const errData = await response.json();
        toast.error(`eroare: ${errData.error}`, { id: loadingToast });
      }
    } catch (error) {
      toast.error('a aparut o eroare de retea', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setEditId(offer._id);
    setFormData({
      produs: offer.produs || '',
      magazin: offer.magazin || '',
      pret_lei: offer.pret_lei || '',
      numar_valabil: offer.numar_valabil || '',
      adresa: offer.adresa || '',
      tag: offer.tag || '',
      reducere: offer.reducere || '',
      ridicare: offer.ridicare || '',
      comanda: offer.comanda || '',
      descriere: offer.descriere || '',
      ingrediente: offer.ingrediente || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMessage('modifica datele si apasa pe actualizeaza');
  };

  const handleDeleteClick = (id) => {
    setDeleteModalId(id);
  };

  const executeDelete = async () => {
    if (!deleteModalId) return;

    const loadingToast = toast.loading('se sterge oferta..');

    try {
      const response = await fetch(`http://localhost:3000/api/products/${deleteModalId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchMyOffers(formData.magazin);
        toast.success('oferta a fost stearsa', { id: loadingToast });
      } else {
        toast.error('eroare la stergere', { id: loadingToast });
      }
    } catch (error) {
      toast.error('eroare la stergere', { id: loadingToast });
    } finally {
      setDeleteModalId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData(prev => ({
      ...prev,
      produs: '', pret_lei: '', numar_valabil: '',
      tag: '', reducere: '', ridicare: '', comanda: '', descriere: '', ingrediente: ''
    }));
    setStatusMessage('');
  };

  if (!isUserLoggedIn) {
    return (
      <div style={{ padding: '2rem 4rem', textAlign: 'center', marginTop: '5rem' }}>
        <h2>trebuie sa fii logat pentru a accesa profilul</h2>
      </div>
    );
  }

  if (storeStatus === 'loading') {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>se incarca datele magazinului..</h2>
      </div>
    );
  }

  if (storeStatus === 'needs setup') {
    return (
      <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px' }}>
          <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: '1rem' }}>bine ai venit in foodloop</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>inainte sa poti posta oferte, te rugam sa inregistrezi detaliile magazinului tau. acest pas se face o singura data</p>

          <form onSubmit={handleStoreSetupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>nume magazin / locatie *</label>
              <input type="text" name="nume" value={storeSetupData.nume} onChange={handleStoreSetupChange} required style={{ padding: '1rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>adresa fizica completa *</label>
              <input type="text" name="adresa" value={storeSetupData.adresa} onChange={handleStoreSetupChange} required placeholder="strada, numar, oras" style={{ padding: '1rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>logo magazin (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setStoreLogo(e.target.files[0])} style={{ padding: '0.5rem 0' }} />
            </div>
            <button type="submit" disabled={isLoading} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: isLoading ? '#9ca3af' : 'var(--color-primary)', color: 'white', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1.1rem' }}>
              {isLoading ? 'se inregistreaza..' : 'inregistreaza magazinul'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', gap: '3rem' }}>
        <div style={{ width: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {profilePicture && !imgError ? (
              <img
                src={profilePicture}
                alt="profil"
                onError={() => setImgError(true)}
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }}
              />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto' }}>
                {displayName ? displayName.charAt(0).toUpperCase() : 'u'}
              </div>
            )}
            <h2 style={{ color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '0.2rem' }}>{formData.magazin}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>partener foodloop</p>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{editId ? 'editeaza oferta' : 'adauga o oferta noua'}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>ajuta la reducerea risipei alimentare. posteaza produsele nevandute de astazi</p>

          {statusMessage && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: statusMessage.includes('stearsa') || statusMessage.includes('actualizata') ? '#dcfce7' : '#fee2e2', color: statusMessage.includes('stearsa') || statusMessage.includes('actualizata') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>nume produs / pachet *</label>
              <input type="text" name="produs" value={formData.produs} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>nume magazin *</label>
              <input type="text" name="magazin" value={formData.magazin || ''} readOnly style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>pret (lei) *</label>
              <input type="number" name="pret_lei" value={formData.pret_lei} onChange={handleChange} required min="0" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>reducere aplicata (%)</label>
              <input type="number" name="reducere" value={formData.reducere} onChange={handleChange} min="0" max="100" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>numar pachete disponibile *</label>
              <input type="number" name="numar_valabil" value={formData.numar_valabil} onChange={handleChange} required min="1" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>tag-uri (separate prin virgula)</label>
              <input type="text" name="tag" value={formData.tag} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>interval comanda</label>
              <input type="text" name="comanda" value={formData.comanda} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>moment ridicare</label>
              <select name="ridicare" value={formData.ridicare} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                <option value="">alege o optiune</option>
                <option value="dimineata">dimineata</option>
                <option value="pranz">pranz</option>
                <option value="seara">seara</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>adresa exacta (cu oras) *</label>
              <input type="text" name="adresa" value={formData.adresa} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>descriere</label>
              <textarea name="descriere" value={formData.descriere} onChange={handleChange} rows="3" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }}></textarea>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 'bold', color: '#374151' }}>alergeni / ingrediente</label>
              <input type="text" name="ingrediente" value={formData.ingrediente} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>

            {!editId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                <label style={{ fontWeight: 'bold', color: '#374151' }}>imagine produs</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '0.5rem 0' }} />
              </div>
            )}

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '1rem', backgroundColor: isLoading ? '#9ca3af' : 'var(--color-primary)', color: 'white', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1.1rem' }}>
                {isLoading ? 'se proceseaza..' : (editId ? 'actualizeaza oferta' : 'publica oferta')}
              </button>
              {editId && (
                <button type="button" onClick={handleCancelEdit} style={{ padding: '1rem', backgroundColor: '#e5e7eb', color: '#374151', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                  anuleaza
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>ofertele tale active</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {myOffers.map(offer => (
            <div key={offer._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#f9fafb' }}>
              <h3 style={{ margin: 0, color: '#004734', fontSize: '1.2rem' }}>{offer.produs}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.95rem' }}>
                <span>pret: <strong>{offer.pret_lei} lei</strong></span>
                {offer.reducere && <span>reducere: <strong>{offer.reducere}%</strong></span>}
              </div>
              <div style={{ color: '#4b5563', fontSize: '0.95rem' }}>
                <span>stoc ramas: <strong>{offer.numar_valabil} buc.</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <button onClick={() => handleEdit(offer)} style={{ flex: 1, padding: '0.6rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#374151', transition: '0.2s' }}>editeaza</button>
                <button onClick={() => handleDeleteClick(offer._id)} style={{ flex: 1, padding: '0.6rem', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#991b1b', transition: '0.2s' }}>sterge</button>
              </div>
            </div>
          ))}
          {myOffers.length === 0 && <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>nu ai nicio oferta activa momentan</p>}
        </div>
      </div>

      {deleteModalId && (
        <div
          onClick={() => setDeleteModalId(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          >
            <h3 style={{ margin: 0, color: '#374151', fontSize: '1.2rem' }}>esti sigur ca vrei sa stergi aceasta oferta?</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>actiunea este permanenta si nu poate fi anulata</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setDeleteModalId(null)}
                style={{ flex: 1, padding: '0.8rem', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
              >
                anuleaza
              </button>
              <button
                onClick={executeDelete}
                style={{ flex: 1, padding: '0.8rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
              >
                sterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProfile;