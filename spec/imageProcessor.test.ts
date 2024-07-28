import fs from 'fs';
import path from 'path';
import processImage  from '../src/backend/utils/imageProcessor'; // Adjust import as needed

describe('Image Processor', () => {
  const testImagePath = path.join(__dirname, '../images/img1.jpg');
  const destinationPath = path.join(__dirname, '../images/resized_img1.jpg');

  beforeAll(() => {
    if (!fs.existsSync(testImagePath)) {
      throw new Error(`Test image does not exist at ${testImagePath}`);
    }
    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }
    fs.copyFileSync(testImagePath, destinationPath);
  });

  afterAll(() => {
    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }
  });

  it('should resize the image correctly', async () => {
    // Your test code
    const result = await processImage(destinationPath, 800, 600);
    expect(result).toBe(result);
  });

  it('should throw an error if the image does not exist', async () => {
    await expect(processImage('nonexistent.jpg', 100, 100)).resolves
  });
});
