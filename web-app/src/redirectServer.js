const express = require('express');

const port = process.env.PORT || 4000;
const router = express.Router();
const app = express();

const indexRouter = router.post('/', function(req, res, next) {
    res.redirect('http://localhost:3005');  // <- need to get actual url of react app
});

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
