import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import processImage from '../utils/imageProcessor';
const router = express.Router();
const imagesDir = path.join(__dirname, '../../../images');
console.log(imagesDir)
const resizedDir = path.join(__dirname, '../../../resized');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});
const upload = multer({ storage: storage ,
    fileFilter: (req,file,cb)=> {
        if(file.mimetype == "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            cb(new Error('Only .jpg format is allowed'))
        }       
    }
});
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const filePath = path.join(imagesDir, req.file.filename);
        if (fs.existsSync(filePath)) {
            return res.json({ message: 'File already exists', filename: req.file.filename });
        }
        res.json({ message: 'File uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading file' });
    }
  });
router.get('/resize', async(req,res)=> {
    const {filename, width, height} = req.query;
    console.log(req.query)
    if(!filename ||!width ||!height){
        return res.status(400).send({message: 'Please provide image, width and height.'})
    }
    const numWidth = parseInt(width as string);
    const numHeight = parseInt(height as string);
    if (isNaN(numWidth) || isNaN(numHeight)) {
        return res.status(400).json({ message: 'Width and height must be valid numbers.' });
    }
    const resizedImagePath = path.join(resizedDir, `${filename}-${numWidth}x${numHeight}.jpg`);
    if (fs.existsSync(resizedImagePath)) {
        return res.sendFile(resizedImagePath);
    }
    try{
        const imageResized = await processImage(filename as string, numWidth, numHeight);
        res.sendFile(imageResized); 
    }
    catch(err) {
        return res.status(500).send({message: 'Error processing image.'})
    }
})
export {router as imageRoutes};