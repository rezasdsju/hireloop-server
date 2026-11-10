import 'dotenv/config'
import express, { request } from 'express';
import cors from 'cors'
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors())


import { MongoClient, ObjectId } from 'mongodb';

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
const applications = database.collection('applications')

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async(req,res)=>{
    const cursor = users.find({})
    const result = await cursor.toArray()
    res.send(result)
})

// Jobs related APIs
app.get('/jobs', async (req, res) => {
  const query = {};

  if (req.query.type) {
    query.type = req.query.type;
  }

  if (req.query.isRemote !== undefined) {
    query.isRemote = req.query.isRemote === 'true';
  }
  if (req.query.category){
    query.category = req.query.category
  }
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { requirements: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const result = await jobs.find(query).toArray();
  res.send(result);
});

app.get('/jobs/:id', async(req,res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await jobs.findOne(query)
  res.send(result)
})
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

app.delete('/jobs/:id', async(req,res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await jobs.deleteOne(query)
  res.send(result)
})


app.get('/applications', async(req,res)=>{
  const query = {}
  if (req.query.applicantId){
    query.userId = req.query.applicantId
  }
  const cursor = applications.find(query)
  const result = await cursor.toArray()
  res.send(result)
})
app.post('/applications', async(req,res)=>{
  const application = req.body
  const result = await applications.insertOne(application)
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;