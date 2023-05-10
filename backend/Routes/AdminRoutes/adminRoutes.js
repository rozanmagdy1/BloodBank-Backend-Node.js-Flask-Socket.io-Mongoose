let {UserController} = require("../../Controllers/userController");
let user_controller = new UserController();
let {BloodRequestController} = require("../../Controllers/bloodRequestController");
let blood_request_controller = new BloodRequestController();
let {MachineLearningController} = require("../../Controllers/machineLearningController");
let ml_controller = new MachineLearningController();
function adminRoutes(adminApp) {
    //users
    adminApp.post("/signup", user_controller.signUp);
    adminApp.post("/login", user_controller.login);
    adminApp.get("/users", user_controller.getAllUsers);
    adminApp.get("/users/:id", user_controller.getUserById);
    adminApp.put("/users/:id", user_controller.updateInfo);
    adminApp.put("/user/profile/update", user_controller.updateUserProfile);
    adminApp.delete("/users/:id", user_controller.deleteUser);
    adminApp.get("/profile", user_controller.getProfile);
    adminApp.post('/forgotPassword',user_controller.forgotPassword);
    adminApp.post('/resetPassword/:token',user_controller.resetPassword);
    adminApp.post('/changePassword',user_controller.changePassword);
    adminApp.put('/verification',user_controller.accountVerification);
    //blood requests
    adminApp.post('/bloodRequest',blood_request_controller.makeBloodRequest);
    adminApp.put('/bloodRequest/done/:id',blood_request_controller.markBloodRequestAsDone);
    adminApp.put('/bloodRequest/:id',blood_request_controller.updateBloodRequestInfo);
    adminApp.delete('/bloodRequest/:id',blood_request_controller.deleteBloodRequest);
    adminApp.get("/bloodRequest", blood_request_controller.getAllBloodRequests);
    adminApp.get("/bloodRequest/:id", blood_request_controller.getBloodRequestByID);
    adminApp.get("/sameBloodType/bloodRequest", blood_request_controller.getAllBloodRequestsWithSameBloodType);
    adminApp.get("/logs/bloodRequest", blood_request_controller.getLogs);
    //machine learning model
    adminApp.post("/predict", ml_controller.getEstimatedInformation);
}

module.exports = {
    adminRoutes
}