import clientController from "./ClientController";

class ServerController{
    currentTheme = 0;
    subjectThemes = [
                    {themeName: 'Math', points: 100, id: 1,},
                    {themeName: 'English', points: 50, id: 2,},
                    {themeName: 'Logic', points: 0, id: 3,},
                    {themeName: '...', points: 0, id: 4,},
                    {themeName: '...', points: 0, id: 5,}];

    async startGame(){

        clientController.triggerEvent('game-start', clientController.subjectTheme);
    }
    async finishGame(points){
        clientController.triggerEvent('game-finish', {subject: clientController.subjectTheme, points: points});
    }

    loading(time = 2000){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('true');
                resolve(true);
            }, time)
        })
    }

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