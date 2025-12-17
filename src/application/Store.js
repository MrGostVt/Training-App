export const DataStore = {
    getStored(key, checkUp = (data) => {return true}){
        try{
            const serialized_data = localStorage.getItem(key);
            const data = JSON.parse(serialized_data);
            if(!checkUp(data)){
                throw 'wrong data'
            }
            return data;
        }
        catch(err){
            // onError();
            this.Store(key, null);
            return null;
        }
    },
    checkStored(key){
        const data = localStorage.getItem(key);
        console.log(key,data);
        if(!data){
            return false;
        }
        return true;
    },
    Store(key, value){
        if(!value && value !== 0){
            localStorage.removeItem(key);
        }
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    },
}