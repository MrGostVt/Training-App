export const DataStore = {
    getStored(key){
        const user = localStorage.getItem(key);
        return user;
    },
    checkStored(key){
        const user = localStorage.getItem(key);
        if(!user){
            return false;
        }
        return true;
    },
    Store(key, value){
        localStorage.setItem(key, value);
    },
}