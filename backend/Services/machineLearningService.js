const axios = require('axios');
const url = 'http://127.0.0.1:5000/predict';
class MachineLearningService {

    async getEstimatedInformation(data) {
        try{
            const response = await axios.post(url,data);
            return response.data
        }catch (e) {
            console.log(e)
            return "error"
        }
    }
}
module.exports = {
    MachineLearningService
}