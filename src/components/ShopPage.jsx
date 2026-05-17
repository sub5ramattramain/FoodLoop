import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppAuth } from '../hooks/useAppAuth';
import ProductCard from '../components/ProductCard';
import { useParams ,useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import { MapContainer, TileLayer, Marker, Popup, } from 'react-leaflet';

function ShopPage(){
    const {shopName} = useParams();
    const navigate = useNavigate();

    const {isUserLoggedIn } = useAppAuth();

    const [product , setProduct] = useState([]);
    const [shopInfo , setShopInfo] = useState(null);
    const [isLoading , setIsLoading] = useState(true);
    const [userLocation , setUserLocation] = useState(null);

    const [reviews , setReviews] = useState(() =>{
         const saved= localStorage.getItem(`reviews_${shopName}`);
         return saved ? JSON.parse(saved) : [];
    });
    const [rating , setRating] =useState(0);
    const [hoverRating , setHoverRating] = useState(0);
    const [comment , setComment] = useState("");
    const [revName , setRevName] = useState("");


    useEffect (()=> {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({lat: position.coords.latitude, lng: position.coords.longitude});
                }, (error) => console.error("locatie eroare" , error)
            );
        }
    }, []);

    useEffect(() => {
        const fetchShopData = async () => {
            setIsLoading(true);
            try{

                const params = new URLSearchParams();
                params.append('magazin' , shopName);

                if(userLocation){
                    params.append('lat' , userLocation.lat);
                    params.append('lng' , userLocation.lng);
                }
                const response = await fetch (`http://localhost:3000/api/products?${params.toString()}`);
                if(response.ok) {

                    const alldata = await response.json();

                    const filteredData = alldata.filter(
                        item => item.magazin?.toLowerCase() === shopName?.toLowerCase()
                    );
                    setProduct(filteredData);

                    if(filteredData.length>0){
                        const firstItem = filteredData [0];
                        setShopInfo({  nume: firstItem.magazin, adresa: firstItem.adresa ,  distance: firstItem.distance , lat: firstItem.lat , lng: firstItem.lng});
                    }
                } else {
                    toast.error("Datele magazinului nu s au incarcat");
                }
            }catch(error) {
                console.error(error);
                toast.error("Eroare conectare server");
            }finally {
                setIsLoading(false);
            }
        };
        if(shopName){
            fetchShopData();
        }
    }, [shopName , userLocation]
);
   
    const handleAddReview = (e) => {
        e.preventDefault();
        if(!isUserLoggedIn) return;
        if(rating === 0){
            toast.error("Alege cel putin o stea");
            return;
        }

        const newReview ={ 
            id: Date.now() , 
            name: revName.trim() || "anonim" , 
            rating: rating ,
            comment: comment.trim() || "no comment",
            date: new Date().toLocaleDateString('ro-RO' , {day: 'numeric' , month: 'long'})
        };

        const updatedRev = [newReview, ...reviews];
        setReviews(updatedRev);
        localStorage.setItem(`reviews_${shopName}`, JSON.stringify(updatedRev));
        setRating(0);
        setComment("");
        setRevName("");
    }

    const formattedProducts = product.map(product => ({
        ...product,
        image: product.image ? `http://localhost:3000${product.image}` : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
    })
    );

    if(isLoading){
        return(
            <div style={{ padding: '2rem 4rem' , backgroundColor: '#f9fafb' , minHeight: '100vh' , display: ' flex' , justifyContent:'center' , alignItems: 'center' }}>
              <p style={{ color: '#6b7280 ' , fontWeight: ' bold'}}>Pagina magazinului se incarca</p>
            </div>
             
        );
    }

    const centerLat = shopInfo?.lat ? parseFloat(shopInfo.lat) : 44.4268; 
    const centerLng = shopInfo?.lng ? parseFloat(shopInfo.lng) : 26.1025;
    return(
        <div style={{padding: '2rem 4rem', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif'}}>
            {/* Buton Intorcere la oferta */} 
            <button
               onClick={() => navigate(-1) }
               style = {{marginBottom: '2rem', backgroundColor: 'white', border: '1px solid #d1d5db',  color: '#374151', padding: '0.6rem 1.2rem', borderRadius: '8px',  fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',transition: '0.2s', fontSize: '0.9rem'}}
            >Intoarce-te la oferte
            </button>
            {/* zona cu magazinul si harta*/}
     
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
               {/*detalii magazin-partea stanga */}
               <div style={{flex: '2 1 550px', backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Profil Magazin</span>
                 <h1 style={{ margin: '0.3rem 0 1rem 0', color: '#004734', fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'lowercase'}}>
                    {shopInfo?.nume || shopName}
                 </h1>

                  <div style={{ display: 'flex' ,flexDirection: 'column', gap: '0.8rem', color: '#555', fontSize: '1rem', marginTop: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem'}}>
                    {shopInfo?.adresa && <div> <strong> adresa:</strong> {shopInfo.adresa} </div>}
                    {shopInfo?.distance !== undefined && shopInfo?.distance !== Infinity && (
                        <div> <strong>distanta: </strong> {shopInfo.distance.toFixed(1)} km </div>
                    )}
                  </div>
               </div>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             {/*harta - dreapta */}
             <div style={{  flex: '1 1 300px' ,height: '220px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
             {shopInfo ? (
               <MapContainer 
                center={[centerLat, centerLng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[centerLat, centerLng]}>
                    <Popup>
                        <strong>{shopInfo.nume}</strong> <br /> {shopInfo.adresa}
                    </Popup>
                </Marker>
              </MapContainer>
              ) : (
                <p>Harta se incarca</p>
              )}
            </div>

       

        {/* reviews*/}
        <div>
            <h3>Recenzii</h3>

            {isUserLoggedIn ? (
                <form onSubmit={handleAddReview} style={{display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem'}}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              style={{ fontSize: '1.4rem' , cursor: 'pointer', color: star <= (hoverRating || rating) ? '#f2ec3c' : '#d1d5db'}}
                              >
                                ★
                              </span>
                       ))}
                    </div>
                    <input type="text" placeholder="Nume" value={revName}
                           onChange={(e) => setRevName(e.target.value)}
                           style={{ padding: '0.5rem'}}
                    />

                    <textarea placeholder="..." value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows="2" 
                               style={{ padding: '0.5rem'}}
                    />

                    <button type="submit" style={{ padding: '0.5rem' , cursor: 'pointer' , backgroundColor: '#004734', color: 'white', border: 'none'}}>
                        Trimite
                    </button>

                </form>
            ):(
                <p>Trebuie sa te conectezi pentru a lasa o recenzie</p>
            ) }

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                {reviews.length === 0 ? (
                    <p> Lasa o recenzie</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} style={{borderTop: '1px solid #eee', paddingTop: '0.5rem'}} >
                             <strong>{rev.name} </strong>
                             <span>{rev.date}</span>
                             <div style={{ color: '#f2ec3c'}}>{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</div>
                             <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>{rev.comment}</p>
                        </div>
                    ))
                )
            }
            </div>
        </div>
      </div>
     </div>

             {formattedProducts.length === 0 ? (
                <p>{shopInfo?.nume || shopName} nu mai are oferte active</p>
             ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {formattedProducts.map(offer =>(
                         <ProductCard 
                           key={offer._id}
                           {...offer}
                           image={offer.image}
                           distance={offer.distance}
                           isUserLoggedIn={isUserLoggedIn}
                           onDeleteSuccess={() => setProduct  (prev => prev.filter (p => p._id !== offer._id))}
                           />
                    ))}
                </div>
             )
             }
           </div> 
        
    )
}

export default ShopPage;