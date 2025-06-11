class ServerController{
    currentTheme = 0;


    async #makeRequest(endpoint, type = 'GET', body){
        const Headers = {
            'Content-Type': 'application/json',
        }

        let request = {
            method: type,
            headers: Headers,
        };
        
        if(type === 'POST'){
            request.body = JSON.stringify(body);
        }

        console.log(request);

        try{
            const result = await fetch((ENV.API + endpoint), request);
            if(result.status >= 400){
                throw result.status + ' Something wrong';
            }
            return (await result.json()).payload
        }
        catch(err){
            console.error(err);
            return null;
        }
    }
}

const serverController = new ServerController();
export default serverController;