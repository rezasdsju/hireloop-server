import 'dotenv/config'
import express from 'express';
import cors from 'cors'
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors())


import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoConnection = await connectToMongoDB()
const database = mongoConnection.db('hireloop')
const users = database.collection('user')
const jobs = database.collection('jobs')


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async(req,res)=>{
    const cursor = users.find({})
    const result = await cursor.toArray()
    res.send(result)
})

// Jobs related APIs
app.post('/jobs', async (req, res) => {
    try {
        const job = req.body
        console.log(job)

        const result = await jobs.insertOne(job)
        res.send(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;