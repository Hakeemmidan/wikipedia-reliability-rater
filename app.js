// Author:       Michael Torres
// Filename:     app.js
// Description:  The purpose of this file is to serve as the main entry file

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json({extended: false}));

app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/articles/search', require('./routes/api/search'));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
