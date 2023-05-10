const bloodRequests = require("../Model/bloodRequests");
const bloodRequestsLog = require("../Model/logs");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");

class RequestBloodService {
  async extractInfoFromToken(token) {
    let decoded = jwt.verify(token, "loginccqq");
    return [decoded.username, decoded.id, decoded.isAdmin];
  }

  async makeBloodRequest(data, token) {
    try {
      let time = new Date()
        .toLocaleString()
        .replaceAll("/", "-")
        .replaceAll(":", ".");
      let data_from_token = await this.extractInfoFromToken(token);
      let [username, _id] = data_from_token;
      data.requester_username = username;
      data.requester_id = _id;
      data.request_date = time;
      const new_request = new bloodRequests(data);
      await new_request.save();
      return true;
    } catch (e) {
      return false;
    }
  }

  async markBloodRequestAsDone(id, donator_username) {
    try {
      const request = await bloodRequests.findById(id);
      if (!request) {
        return null;
      } else {
        if (request.done === true) {
          return "request already did";
        } else {
          let time = new Date()
            .toLocaleString()
            .replaceAll("/", "-")
            .replaceAll(":", ".");
          let log = request.toObject();
          log.done = true;
          log.done_date = time;
          if (donator_username) {
            await bloodRequests.updateOne(
              { _id: id },
              {
                done: true,
                done_date: time,
                donator_username: donator_username,
              }
            );
            log.donator_username = donator_username;
          } else {
            await bloodRequests.updateOne(
              { _id: id },
              { done: true, done_date: time }
            );
          }
          const new_log = new bloodRequestsLog(log);
          await new_log.save();
          return true;
        }
      }
    } catch (e) {
      return null;
    }
  }

  async updateBloodRequestInfo(id, data) {
    try {
      const request = await bloodRequests.findById(id);
      if (request.done === true) {
        return "you can't update of request done";
      } else {
        if (!request) {
          return null;
        } else {
          return await bloodRequests.updateOne({ _id: id }, data);
        }
      }
    } catch (e) {
      return null;
    }
  }

  async deleteBloodRequest(id) {
    try {
      const request = await bloodRequests.findById(id);
      if (request.done === true) {
        return "you can't delete request done";
      } else {
        if (!request) {
          return null;
        } else {
          return await bloodRequests.deleteOne({ _id: id });
        }
      }
    } catch (e) {
      return null;
    }
  }

  async getAllBloodRequests() {
    try {
      return await bloodRequests.find({});
    } catch (e) {
      return null;
    }
  }

  async getBloodRequestByID(id) {
    try {
      const user = await bloodRequests.findById(id);
      if (!user) {
        return null;
      } else {
        return user;
      }
    } catch (e) {
      return null;
    }
  }

  async getAllBloodRequestsWithSameBloodType(token) {
    try {
      let data_from_token = await this.extractInfoFromToken(token);
      let [, id] = data_from_token;
      const user = await User.findById(id);
      return await bloodRequests.find({
        bloodType: user.bloodType,
        done: false,
      });
    } catch (e) {
      return null;
    }
  }

  async getLogs(token) {
    try {
      let data_from_token = await this.extractInfoFromToken(token);
      let [username, ,] = data_from_token;
      return await bloodRequestsLog.find({
        requester_username: username,
      });
    } catch (e) {
      return null;
    }
  }
}

module.exports = {
  RequestBloodService,
};
