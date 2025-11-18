import express from 'express';

const app = express();

app.get('/', (req,res)=>{
   return res.json({'status': 'healthy'})
})

app.listen(4004, () => {
    console.log('Server running on port 4004 dev enviornment...');
}); 