const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const app = express();

dotenv.config({ path: './config.env' });

// mongoose.connect('mongodb://localhost/blog', {
//     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
// });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connection Successful'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
});

app.use('/articles', articleRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});