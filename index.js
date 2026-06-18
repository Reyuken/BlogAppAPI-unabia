const dotenv = require('dotenv');
const express = require("express");
const mongoose = require("mongoose");

const cors = require('cors');

const userRoutes = require(`./routes/user`);
const blogPostsRoutes = require(`./routes/blogPosts`);
const commentsRoutes = require(`./routes/comments`);

const app = express();
const port = 4000;

dotenv.config();

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    // Allow requests only from this frontend
    // origin: ['http://localhost:8000'],
    origin: '*',
    credentials: true,
    // Use 200 to tell the browser it's OK to continue the request because some browsers fail if its not 200
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/users', userRoutes);
app.use('/posts', blogPostsRoutes);
app.use('/comments', commentsRoutes);


if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`));
};

module.exports = { app, mongoose };
