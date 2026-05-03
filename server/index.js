const express = require('express');
const app = express();

const mongoose = require('mongoose'); 

const multer = require('multer'); 
const path = require('path'); 

const cors = require('cors');
app.use(cors()); //pentru legare frontend si backend

const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
 provider: 'openstreetmap'
});



//calculare distanta cu Harvesine
function HaversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (x) => x * Math.PI / 180;
  const R = 6371; // Raza Pământului în km

  const dLaT = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a = Math.sin(dLaT / 2) * Math.sin(dLaT / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distanța în km
}




//pentru adaugarea de imagini
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads/');
 },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.use('/uploads' , express.static('uploads'));


//Pentru MongoDB
mongoose.connect('mongodb://localhost:27017/dashboard')
 .then(function() {
 console.log('Conectat la MongoDB!');
 })
 .catch(function(err) {
 console.error('Eroare conectare MongoDB:', err);
 });

 const Products = require('./models/Products');
const PORT = 3000;

app.use(express.json());

// Prima ruta: raspunde la GET /
app.get('/', function(req, res) {
 res.json({ message: 'Serverul functioneaza!' });
});

// Date (temporar in memorie, vom folosi MongoDB mai tarziu)


//  returneaza toate produsele in functie de filtre
app.get('/api/products', async function(req, res) {
 try {
 const query = {};
 if(req.query.tags){
  const tagList = req.query.tags.split(',').map(tag => tag.trim());
  query.$or = tagList.map(t => ({tag: { $regex: t, $options: 'i' }}));
 }

 if (req.query.minim_reducere) {
  query.reducere = { $gte: Number(req.query.minim_reducere) }; //asta e pentru cautarea produselor care au reducere peste 50%
 }

 if (req.query.ridicare) {
  // Cauta produsele care au intervalul specificat (adica dimineata, pranz sau seara)
  query.ridicare = { $regex: req.query.ridicare, $options: 'i' };
}

  if (req.query.nume) {
      query.produs = { $regex: req.query.nume, $options: 'i' }; //cauta dupa nume
    }

 const products = await Products.find(query);

  if(req.query.lat && req.query.lng){               //cod pentru calcularea distantei, clientul trebuie sa trimita lat si lng
    const userLat = Number(req.query.lat);
    const userLng = Number(req.query.lng);

    products = products.map(p => {
      const pObj = p.toObject();
      if(p.lat && p.lng){
        pObj.distance = HaversineDistance(userLat, userLng, p.lat, p.lng);
      }
      else {
        pObj.distance = Infinity; //daca a uitat magazinul sa puna locatia, il trimitem la finalul listei
      }
      return pObj;
    });

    products.sort((a,b) => a.distance - b.distance);
  }


 res.json(products);
 } catch (err) {
 res.status(500).json({ error: 'Eroare ' + err });
 }
});


app.get('/api/products/:id', async function (req, res) {
  try {
    // asta e functia de actualizare get
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Error: Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la căutare: ' + err.message });
  }
});


app.put('/api/products/:id', async function (req, res) {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Error: Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Eroare la actualizare: ' + err.message });
  }
});


// adauga un produs nou
app.post('/api/products', upload.single('image'), async function(req, res) {
 try {
  let lat = 0, lng = 0;
  if(req.body.adresa){
    const geo = await geocoder.geocode(req.body.adresa);
 
    lat = geo.length > 0 ? geo[0].latitude : 0;
    lng = geo.length > 0 ? geo[0].longitude : 0;
  }

 
 const newProduct = new Products({
 produs: req.body.produs,
 magazin: req.body.magazin,
 pret_lei: req.body.pret_lei,
 numar_valabil: req.body.numar_valabil,
 adresa: req.body.adresa,
 lat: lat,
 lng: lng,
 image: req.file ? `/uploads/${req.file.filename}` : "",
 tag: req.body.tag,
 reducere: req.body.reducere,
 ridicare: req.body.ridicare,
 comanda: req.body.comanda
 });
 const saved = await newProduct.save();
 res.status(201).json(saved);
 } catch (err) {
 res.status(400).json({ error: err.message });
 }
});


//Functie delete
app.delete('/api/products/:id', async function (req, res) {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Produsul nu a fost găsit pentru ștergere' });
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la ștergere: ' + err.message });
  }
});



// Nu se mai pune nimic dupa app.listen
app.listen(PORT, function() {
 console.log(`Serverul functioneaza pe portul ${PORT}`);
});