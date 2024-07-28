
let selectedImage = null
const starterImages = ['img1.jpg','img2.jpg','img3.jpg','img4.jpg','img5.jpg'];
const resizeBtn = document.querySelector('#resize-btn');
function addImg(imgName) {
    const imgGallery = document.querySelector('#img-gallery');
    const img = document.createElement('img');
    img.classList.add('gallery')
    img.src = `../../images/${imgName}`;
    img.onclick = () => selectImg(imgName);
    imgGallery?.appendChild(img);
}
function selectImg(imgName) {
    selectedImage = imgName;
    const images = document.querySelectorAll('#img-gallery img');
    images.forEach((img) => img.classList.remove('selected'));
    const selectedImg = Array.from(images).find((img) => img.src.includes(imgName));
    selectedImg?.classList.add('selected');
}
async function resizeImg() {
    if (!selectedImage) {
        alert('Please Select an Image');
        return;
    }
    const width = document.querySelector('#width-selector').value;
    const height = document.querySelector('#height-selector').value;   
    if(!width || !height) {
        alert('Please Select Width and Height');
        return;
    } 
    const url = `http://localhost:3000/api/images/resize?filename=${selectedImage}&width=${width}&height=${height}`;
    const urlDiv = document.querySelector('#img-url');
    urlDiv.innerHTML = `Resized image url: <a href="${url}">Image Link</a>`;
}
async function uploadImg() {
        const inputUp = document.querySelector('#img-upload');
        const imgFile = inputUp.files?.[0];
        if(!imgFile) {
            alert('Please Upload an Image');
            return;
        }
        const formData = new FormData();
        formData.append('image', imgFile);
        try {
            const response = await fetch('http://localhost:3000/api/images/upload', {
                method: 'POST',
                body: formData
                });
                if(response.ok) {
                    const data = await response.json();
                    alert('Image uploaded successfully');
                    addImg(data.filename);
                }else {
                    const errorData = await response.json();
                    alert(`Error uploading image: ${errorData.error}`);
                  }
            }
            
            catch (error) {
                console.error('Error uploading:', error);
            }
}
document.addEventListener('DOMContentLoaded' , ()=> {
    starterImages.forEach(addImg);
});
