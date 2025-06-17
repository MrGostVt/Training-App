const ImageLoad = () => { 
    const imageContext = require.context('../assets/images', true);
    const images = {};
    
    imageContext.keys().forEach((key) => {
        const formattedKey = key.replace('./', '');
        images[formattedKey] = imageContext(key);
    });
    
    return images;
}

export const LoadedImages = ImageLoad();
