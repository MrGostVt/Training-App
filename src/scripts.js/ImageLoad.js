const ImageLoad = () => { 
    const imageContext = require.context('../imgs', true);
    
    imageContext.keys().forEach((key) => {
        const formattedKey = key.replace('./', '');
        images[formattedKey] = imageContext(key);
    });
    
    return imageContext;
}

export const LoadedImages = ImageLoad();