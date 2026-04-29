const express = require('express');
const app = express();
const PORT = 3000;
const { v4:uuidv4 } = require('uuid');

app.use(express.json());

// Prima ruta: raspunde la GET /
app.get('/', function(req, res) {
 res.json({ message: 'Serverul functioneaza!' });
});

// Date (temporar in memorie, vom folosi MongoDB mai tarziu)
const products = [
 { id: uuidv4(), Produs: "Branza Del", Magazin: "Profit", Pret_lei: 123, Numar_Valabil: 5 , Adresa: "Str. Scurta nr. 10, Brasov"},
 { id: uuidv4(), Produs: "HotDog", Magazin: "CarFor", Pret_lei: 44, Numar_Valabil: 10 , Adresa: "Str. Soarelui nr. 5, Brasov"},
 { id: uuidv4(), Produs: "Meniul Zilei", Magazin: "Morcoverie", Pret_lei: 22, Numar_Valabil: 15 , Adresa: "Str. Forestului nr. 8, Brasov"},
 { id: uuidv4(), Produs: "Taitei Asiatici", Magazin: "Chapsticz", Pret_lei: 30, Numar_Valabil: 20 , Adresa: "Str. Mihai Rapidul nr. 15, Brasov"},
];

//  returneaza toate produsele
app.get('/api/products', function(req, res) {
 res.json(products);
});

app.get('/api/products/:id', function (req, res) {
  const id = req.params.id;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(product);
});


app.put('/api/products/:id', function (req, res) {
    const id = req.params.id;

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Not found' });
    }

    product.Produs = req.body.Produs || product.Produs;
    product.Magazin = req.body.Magazin || product.Magazin;
    product.Pret_lei = req.body.Pret_lei || product.Pret_lei;
    product.Numar_Valabil = req.body.Numar_Valabil || product.Numar_Valabil;
    product.Adresa = req.body.Adresa || product.Adresa;

    res.json(product);
});


// adauga un produs nou
app.post('/api/products', function(req, res) {
 const newProduct = {
 id: uuidv4(),
 Produs: req.body.Produs,
 Magazin: req.body.Magazin,
 Pret_lei: req.body.Pret_lei,
 Numar_Valabil: req.body.Numar_Valabil,
 Adresa: req.body.Adresa,
 };
 products.push(newProduct);
 res.status(201).json(newProduct);
});

/*
testare adaugare:
fetch('http://localhost:3000/api/products', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ Produs: "Lapte ", Magazin: "Pennies", Pret_lei: 13, Numar_Valabil: 2, Adresa: "Str. Scurta nr. 5, Brasov" })
})

.then(r => r.json())
.then(data => console.log(data));

*/

//Functie delete
app.delete('/api/products/:id', function (req, res) {
  const id = req.params.id;

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  products.splice(index, 1);

  res.json({ message: 'Deleted' });
});

/*
testare delete:
fetch('http://localhost:3000/api/products/id', { method: 'DELETE' })
 .then(r => r.json()).then(data => console.log(data));
*/

//foarte important: ca frontendul sa stearga produs, face o functie care ia id-ul (care e string acum) de la produs si il baga in modelul de testare delete


// Nu se mai pune nimic dupa app.listen
app.listen(PORT, function() {
 console.log(`Serverul functioneaza pe portul ${PORT}`);
});