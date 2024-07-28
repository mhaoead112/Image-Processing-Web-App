import sharp from "sharp";
import path from "path";
import fs from 'fs';

const processImage = async (filename:string , width:number , height:number):Promise<string> => {
    try {
        const inputPath = path.join(__dirname , '../../../images', filename);
        const outputPath = path.join(__dirname,'../../../resized' ,`${width}x${height}-${filename}`);
        if(!fs.existsSync(inputPath)){

            throw new Error('Image does not exist');
        }
        if(fs.existsSync(outputPath)) {
            return outputPath;
        }
        await sharp(inputPath).resize(width,height).toFile(outputPath);

        return outputPath;
    }
    catch(err) {
        console.error('Error Processing The Image:' , err)
        return 'Error';
    }
}
export default processImage;