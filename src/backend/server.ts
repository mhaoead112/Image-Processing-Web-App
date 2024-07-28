import express from 'express';
import path from 'path';
import cors from 'cors'
import { imageRoutes } from './routes/imageRoutes';
const app = express();
const port = 3000;

app.use(cors())
app.use(express.static(path.join(__dirname, '../frontend')))
app.use('/images',express.static(path.join(__dirname,'../../images')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.use('/api/images', imageRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
export default app