const express = require('express')
const app = express()
require("dotenv").config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xeaidsx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const taskCollection = client.db('task-manager').collection('tasks');

    app.get('/tasks/:email',async(req,res)=>{
        const email = req.params.email
        const query = {email : email}
        const result = await taskCollection.find(query).toArray()
        res.send(result)       
    })
    app.post('/addtasks',async(req,res)=>{
      console.log('task',req.body)
      const body = req.body 
      const result = await taskCollection.insertOne(body)
      res.send(result)   

  })

  app.put('/updateTask/:status/:id',async(req,res)=>{
    const status = req.params.status
    const Id = req.params.id
    const query = { _id : new ObjectId(Id)  }
    const updateDoc = {
      $set:{
        status : status
      }
    }
    const result = await taskCollection.updateOne(query,updateDoc)
    res.send(result)
    
  })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Finally block
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Task is ready')
})
app.listen(port, () => {
  console.log(`Task is running on port ${port}`)
})

module.exports = app;