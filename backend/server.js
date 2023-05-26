const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const { AdminMiddleWare } = require("./Middlewares/adminMiddleWare");
const { WebsiteMiddleWare } = require("./Middlewares/websiteMiddleWare");

const { adminRoutes } = require("./Routes/AdminRoutes/adminRoutes");
const { WebsiteRoutes } = require("./Routes/WebsiteRoutes/websiteRoutes");
const mongoose = require("mongoose");

const app = express();
const adminApp = express();
const websiteApp = express();

adminRoutes(adminApp);
WebsiteRoutes(websiteApp);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", AdminMiddleWare, adminApp);
app.use("/website", WebsiteMiddleWare, websiteApp);

const port = process.env.PORT || 8000;
const URI_DB = process.env.MONGO_URI;
mongoose
  .connect(
      URI_DB,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: { w: 'majority' }
      }
  )
  .then(() => {
    app.listen(port, function () {
      console.log(`running on http://localhost:${port}`);
    });
  });
