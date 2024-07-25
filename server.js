const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

let clients = [];

app.use(express.static('public'));

app.get('/soundemitter', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rota para emitir o som
// Rota para emitir o som dinamicamente
app.get('/checksize/:size', async (req, res) => {
   console.log("beat!")
   const size = parseInt(req.params.size, 10);
   try {
     const response = await axios.get('http://localhost:3001/dataArray'); // Substitua pela URL da sua API
     const dataArray = response.data;
 
     if (Array.isArray(dataArray) && dataArray.length > size) {
       clients.forEach(client => client.res.write('data: sound\n\n'));
     }
 
     res.sendStatus(200);
   } catch (error) {
     console.error(error);
     res.sendStatus(500);
   }
 });

// Rota para receber eventos do servidor (SSE)
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push({ id: Date.now(), res });

  req.on('close', () => {
    clients = clients.filter(client => client.id !== req.id);
  });
});

// Função para checar o tamanho do array a cada 30 segundos
const checkInterval = (size) => setInterval(async () => {
   try {
     const response = await axios.get(`http://localhost:3000/checksize/${size}`);

   } catch (error) {
     console.error(error);
   }
 }, 2000);

 // Inicializa o intervalo com tamanho 150 por padrão
// checkInterval(1);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
