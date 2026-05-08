import React, { useState } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';

function Profile() {
  const { isUserLoggedIn, displayName, profilePicture, logout } = useAppAuth();

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('se incarca oferta....');

    const data = new FormData();
    for (const key in formData)
      data.append(key, formData[key]);

    if (imageFile)
      data.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setStatusMessage('oferta adaugata cu succes!');
        setFormData({
          produs: '', magazin: '', pret_lei: '', numar_valabil: '',
          adresa: '', tag: '', reducere: '', ridicare: '', comanda: '', descriere: '', ingrediente: ''
        });
        setImageFile(null);
        e.target.reset();
      }
      else {
        const errData = await response.json();
        setStatusMessage(`eroare: ${errData.error}`);
      }
    } catch (error) {
      console.error('error submitting form:', error);
      setStatusMessage('eroare la adaugarea ofertei.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUserLoggedIn) {
    return (
      <div style={{ padding: '2rem 4rem', textAlign: 'center', marginTop: '5rem', }}>
        <h2>trebuie sa fii logat pentru a accesa profilul tau</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', gap: '3rem' }}>

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
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>adauga o oferta noua</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>ajuta la reducerea risipei alimentare. posteaza produsele nevandute de astazi.</p>

        {statusMessage && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: statusMessage.includes('✅') ? '#dcfce7' : '#fee2e2', color: statusMessage.includes('✅') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>nume produs / pachet *</label>
            <input type="text" name="produs" value={formData.produs} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: pachet surpriza patiserie" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>nume magazin *</label>
            <input type="text" name="magazin" value={formData.magazin} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: brutaria simplu" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>pret (lei) *</label>
            <input type="number" name="pret_lei" value={formData.pret_lei} onChange={handleChange} required min="0" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: 15" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>reducere aplicata (%)</label>
            <input type="number" name="reducere" value={formData.reducere} onChange={handleChange} min="0" max="100" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: 50" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>numar pachete disponibile *</label>
            <input type="number" name="numar_valabil" value={formData.numar_valabil} onChange={handleChange} required min="1" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: 3" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>tag-uri (separate prin virgula)</label>
            <input type="text" name="tag" value={formData.tag} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: dulce, patiserie, vegan" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>interval comanda</label>
            <input type="text" name="comanda" value={formData.comanda} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: 08:00-16:00" />
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
            <input type="text" name="adresa" value={formData.adresa} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: strada lunga 10, brasov" />
            <small style={{ color: '#6b7280' }}>folosita pentru a afisa magazinul corect pe harta utilizatorilor.</small>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>descriere</label>
            <textarea name="descriere" value={formData.descriere} onChange={handleChange} rows="3" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }} placeholder="scurta descriere a pachetului salvat..."></textarea>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>alergeni / ingrediente</label>
            <input type="text" name="ingrediente" value={formData.ingrediente} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="ex: gluten, lapte, oua" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', color: '#374151' }}>imagine produs</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '0.5rem 0' }} />
          </div>

          <button type="submit" disabled={isLoading} style={{ gridColumn: 'span 2', padding: '1rem', backgroundColor: isLoading ? '#9ca3af' : 'var(--color-primary)', color: 'white', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '1rem', fontSize: '1.1rem' }}>
            {isLoading ? 'se proceseaza...' : 'publica oferta'}
          </button>
        </form>
      </div>
    </div>
  );

}

export default Profile;