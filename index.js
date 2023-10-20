const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aj8rb8b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Product Collection
        const productCollection = client.db('productsDb').collection('products')
        const cartCollection = client.db('productsDb').collection('cart')


        // Add a Product
        app.post('/products', async (req, res) => {
            const newProduct = req.body
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        // Get Product
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/cart', async (req, res) => {
            const viewDetails = req.body
            const result = await cartCollection.insertOne(viewDetails)
            res.send(result)
        })

        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const result =await cartCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to FashionFlare server!')
})

app.listen(port, () => {
    console.log(`FashionFlare server is running on port : ${port}`);
})