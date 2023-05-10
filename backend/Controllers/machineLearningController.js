let {MachineLearningService} = require("../Services/machineLearningService");
let service = new MachineLearningService();
class MachineLearningController {

    async getEstimatedInformation(req,res) {
        let data = req.body;
        let result = await service.getEstimatedInformation(data);
        if(result.prediction === '1'){
            res.status(200).json({
                result : "Person will donate again"
            })
        }else if(result.prediction === '0'){
            res.status(200).json({
                result : "Person will not donate again"
            })
        }else{
            res.status(500).json({
                message : "Error happen!"
            })
        }
    }
}
module.exports ={
    MachineLearningController
}