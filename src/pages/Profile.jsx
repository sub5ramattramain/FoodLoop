import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';

function Profile() {
  const { isUserLoggedIn, displayName, profilePicture } = useAppAuth();

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [myOffers, setMyOffers] = useState([]);
  const [editId, setEditId] = useState(null);

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
    if (isUserLoggedIn && displayName) {
      fetchMyOffers();
    }
  }, [isUserLoggedIn, displayName]);

  const fetchMyOffers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter(p => p.magazin && p.magazin.toLowerCase() === displayName.toLowerCase());
        setMyOffers(filtered);
      }
    } catch (error) {
      setStatusMessage('a aparut o eroare la incarcarea ofertelor.');
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
    setStatusMessage(editId ? 'se actualizeaza oferta...' : 'se incarca oferta...');
    formData.magazin = displayName;

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
        setStatusMessage(editId ? 'oferta a fost actualizata!' : 'oferta a fost publicata cu succes!');
        setFormData({
          produs: '', magazin: '', pret_lei: '', numar_valabil: '',
          adresa: '', tag: '', reducere: '', ridicare: '', comanda: '', descriere: '', ingrediente: ''
        });
        setImageFile(null);
        setEditId(null);
        e.target.reset();
        fetchMyOffers();
      } else {
        const errData = await response.json();
        setStatusMessage(`eroare: ${errData.error}`);
      }
    } catch (error) {
      setStatusMessage('a aparut o eroare de retea.');
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
    setStatusMessage('modifica datele si apasa pe actualizeaza.');
  };

  const handleDelete = async (id) => {
    const confirmare = window.confirm('esti sigur ca vrei sa stergi aceasta oferta?');
    if (!confirmare) return;

    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchMyOffers();
        setStatusMessage('oferta a fost stearsa.');
      }
    } catch (error) {
      setStatusMessage('eroare la stergere.');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      produs: '', magazin: '', pret_lei: '', numar_valabil: '',
      adresa: '', tag: '', reducere: '', ridicare: '', comanda: '', descriere: '', ingrediente: ''
    });
    setStatusMessage('');
  };

  if (!isUserLoggedIn) {
    return (
      <div style={{ padding: '2rem 4rem', textAlign: 'center', marginTop: '5rem' }}>
        <h2>trebuie sa fii logat pentru a accesa profilul.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      <div style={{ display: 'flex', gap: '3rem' }}>
        <div style={{ width: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {profilePicture ? (
              <img src={profilePicture} alt="profil" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }} />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto' }}>
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <h2 style={{ color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '0.2rem' }}>{displayName}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>partener foodloop</p>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{editId ? 'editeaza oferta' : 'adauga o oferta noua'}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>ajuta la reducerea risipei alimentare. posteaza produsele nevandute de astazi.</p>

          {statusMessage && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: statusMessage.includes('✅') ? '#dcfce7' : '#fee2e2', color: statusMessage.includes('✅') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
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
              <input type="text" name="magazin" value={displayName || ''} readOnly style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }} />
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
                {isLoading ? 'se proceseaza...' : (editId ? 'actualizeaza oferta' : 'publica oferta')}
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
                <button onClick={() => handleDelete(offer._id)} style={{ flex: 1, padding: '0.6rem', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#991b1b', transition: '0.2s' }}>sterge</button>
              </div>
            </div>
          ))}
          {myOffers.length === 0 && <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>nu ai nicio oferta activa momentan.</p>}
        </div>
      </div>

    </div>
  );
}

export default Profile;