const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const multer = require('multer'); 
const path = require('path'); 
const cors = require('cors');
app.use(cors()); //pentru legare frontend si backend


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


//  returneaza toate produsele
app.get('/api/products', async function(req, res) {
 try {
 const products = await Products.find();
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
 const newProduct = new Products({
 produs: req.body.produs,
 magazin: req.body.magazin,
 pret_lei: req.body.pret_lei,
 numar_valabil: req.body.numar_valabil,
 adresa: req.body.adresa,
 image: req.file ? `/uploads/${req.file.filename}` : ""
 });
 const saved = await newProduct.save();
 res.status(201).json(saved);
 } catch (err) {
 res.status(400).json({ error: err.message });
 }
});

/*

testare adaugare:
fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    produs: "Telemea de munte", 
    magazin: "Piata Sfatului", 
    pret_lei: 25, 
    numar_valabil: 10, 
    adresa: "Brasov, Centru" 
  })
})
.then(r => r.json())
.then(data => console.log('Produs salvat în DB:', data));
*/

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

/*
testare delete:
const idDeSters = 'ID_COPIAT_AICI'; 

fetch(`http://localhost:3000/api/products/${idDeSters}`, { 
  method: 'DELETE' 
})
.then(r => r.json())
.then(data => console.log('Rezultat ștergere:', data));
*/


/*
testare update:
const idDeModificat = 'ID_COPIAT_AICI';

fetch(`http://localhost:3000/api/products/${idDeModificat}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    pret_lei: 30,
    numar_valabil: 5 
  })
})
.then(r => r.json())
.then(data => console.log('Produs actualizat:', data));
*/

// Nu se mai pune nimic dupa app.listen
app.listen(PORT, function() {
 console.log(`Serverul functioneaza pe portul ${PORT}`);
});