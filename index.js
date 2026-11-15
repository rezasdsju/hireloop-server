import 'dotenv/config'
import express, { request } from 'express';
import cors from 'cors'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors())


import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);


const myLogger = (req, res, next) => {
  console.log('now hitting: ', req.url, req.headers)
  next()

}


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
const payments = database.collection('payments')
const sessions = database.collection('session')

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }
  const session = await sessions.findOne({ token })
  if (!session) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }
  const user = await users.findOne({ _id: new ObjectId(session.userId) })
  if (!user) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }
  req.user = user
  next()
}


const verifySeeker = async(req,res,next)=>{
  if (req.user.role!=='seeker'){
    res.status(403).send({message:'Forbidden'})
    return
  }
  next()
}
const verifyRecruiter = async(req,res,next)=>{
  if (req.user.role!=='recruiter'){
    res.status(403).send({message:'Forbidden'})
    return
  }
  next()
}
const verifyAdmin = async(req,res,next)=>{
  if (req.user.role!=='admin'){
    res.status(403).send({message:'Forbidden'})
    return
  }
  next()
}
const verifyRecruiterOrAdmin = async(req,res,next)=>{
  if (req.user.role!=='recruiter' && req.user.role!=='admin'){
    res.status(403).send({message:'Forbidden'})
    return
  }
  next()
}
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  const cursor = users.find({})
  const result = await cursor.toArray()
  res.send(result)
})
app.get('/users/:id/premium', async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const result = await users.findOne(query, { projection: { premium: 1 } })
  res.send(result)
})


app.patch('/users/:id/role', verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const updatedDoc = {
    $set: {
      role: req.body.role
    }
  }
  const result = await users.updateOne(query, updatedDoc)
  res.send(result)
})

// Jobs related APIs
app.get('/jobs', async (req, res) => {
  const query = {};

  // The filter sidebar sends `jobType`; older links use `type`.
  const type = req.query.type || req.query.jobType;
  if (type) {
    query.type = type;
  }

  if (req.query.isRemote !== undefined) {
    query.isRemote = req.query.isRemote === 'true';
  }
  if (req.query.category) {
    query.category = req.query.category
  }

  if (req.query.recruiterId) {
    query.recruiterId = req.query.recruiterId
  }
  if (req.query.search) {
    // Search the current field names and the legacy ones still in older records.
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { companyName: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } },
      { responsibilities: { $regex: req.query.search, $options: 'i' } },
      { qualifications: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { requirements: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const result = await jobs.find(query).toArray();
  res.send(result);
});

app.get('/jobs/:id', async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const result = await jobs.findOne(query)
  res.send(result)
})
app.post('/jobs',verifyToken,verifyRecruiter, async (req, res) => {
  try {
    // Always attach the signed-in recruiter, never trust the request body.
    const job = { ...req.body, recruiterId: req.user._id.toString() }

    const result = await jobs.insertOne(job)
    res.send(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/jobs/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const job = await jobs.findOne(query)
  if (!job) {
    return res.status(404).send({ message: 'Job not found' })
  }
  if (job.recruiterId !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden' })
  }
  const result = await jobs.deleteOne(query)
  res.send(result)
})


app.get('/applications', verifyToken, async (req, res) => {
  const query = {}

  // A seeker can only see their own applications.
  if (req.user.role === 'seeker') {
    query.userId = req.user._id.toString()
  } else if (req.query.applicantId) {
    query.userId = req.query.applicantId
  }

  if (req.query.jobId) {
    const job = await jobs.findOne({ _id: new ObjectId(req.query.jobId) })
    if (!job) {
      return res.status(404).send({ message: 'Job not found' })
    }
    if (job.recruiterId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Forbidden' })
    }
    query.jobId = req.query.jobId
  }

  const cursor = applications.find(query)
  const result = await cursor.toArray()
  res.send(result)
})
app.get('/applications/count', async (req, res) => {
  const query = {}
  if (req.query.applicantId) {
    query.userId = req.query.applicantId
  }
  const result = await applications.countDocuments(query)
  res.send({ count: result })
})
app.patch('/applications/:id', verifyToken, verifyRecruiterOrAdmin, async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const application = await applications.findOne(query)
  if (!application) {
    return res.status(404).send({ message: 'Application not found' })
  }

  // Recruiters may only update applications for their own jobs.
  const job = await jobs.findOne({ _id: new ObjectId(application.jobId) })
  if (!job) {
    return res.status(404).send({ message: 'Job not found' })
  }
  if (job.recruiterId !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden' })
  }

  const updatedDoc = {
    $set: {
      status: req.body.status
    }
  }
  const result = await applications.updateOne(query, updatedDoc)
  res.send(result)
})

app.post('/applications', verifyToken, verifySeeker, async (req, res) => {
  const application = {
    ...req.body,
    userId: req.user._id.toString(),
    userEmail: req.user.email
  }

  const existing = await applications.findOne({
    userId: application.userId,
    jobId: application.jobId
  })
  if (existing) {
    return res.status(409).send({ message: 'You have already applied to this job' })
  }

  const result = await applications.insertOne(application)
  res.send(result)
})


// Payments related APIs
app.post('/payments/checkout-verify', async (req, res) => {
  const { sessionId } = req.body
  if (!sessionId) {
    return res.status(400).send({ success: false, message: 'Session ID is required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const {
      status,
      payment_status,
      customer_email,
      metadata,
      payment_intent
    } = session

    if (status !== 'complete' || payment_status !== 'paid') {
      return res.status(400).send({ success: false, message: 'Payment verification failed' })
    }
    if (!metadata?.userId || !ObjectId.isValid(metadata.userId)) {
      return res.status(400).send({ success: false, message: 'Payment is missing a valid user' })
    }

    const existingPayment = await payments.findOne({ sessionId })
    if (existingPayment) {
      return res.send({ success: false, message: 'Payment already verified' })
    }

    const payment = {
      sessionId,
      status,
      payment_status,
      customer_email,
      userId: metadata.userId,
      payment_date: new Date(),
      payment_intent
    }
    const result = await payments.insertOne(payment)

    const updateResult = await users.updateOne(
      { _id: new ObjectId(metadata.userId) },
      { $set: { premium: true } }
    )

    return res.send({ success: true, result, updateResult })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;