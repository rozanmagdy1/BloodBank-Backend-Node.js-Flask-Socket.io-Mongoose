const User = require('../Model/User');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require("crypto");

class UserService {

    async signUp(data) {
        try {
            const user = await User.findOne({"username": data.username});
            if (!user) {
                data.password = await bcrypt.hash(data.password, 10);
                data.verified = false;
                const new_user = new User(data);
                await new_user.save();
                return true;
            } else {
                return "the username already exists use another one!"
            }
        } catch (e) {
            return false;
        }
    }

    async login(username, password) {
        try {
            const user = await User.findOne({"username": username});
            if (!user) {
                return {statues: false, message: "user not found"};
            } else {
                if (!await bcrypt.compare(password, user.password)) {
                    return {statues: false, message: "password wrong"};
                } else {
                    let loginToken = jwt.sign({username: user.username, id: user._id, isAdmin: user.isAdmin}
                        , 'loginccqq');
                    return {
                        statues: true,
                        message: "login successfully",
                        token: loginToken,
                    };
                }
            }
        } catch (e) {
            return null;
        }
    }

    async listAllUsers() {
        try {
            return await User.find({});
        } catch (e) {
            return null;
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                return null;
            } else {
                return user;
            }
        } catch (e) {
            return null;
        }
    }

    async deleteUserById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                return null;
            } else {
                return await User.deleteOne({_id: id});
            }
        } catch (e) {
            return null;
        }
    }

    async updateUserById(id, data) {
        try {
            const user = await User.findById(id);
            if (!user) {
                return null;
            } else {
                return await User.updateOne({_id: id}, data);
            }
        } catch (e) {
            return null;
        }
    }

    async getProfile(token) {
        try {
            let data_from_token = await this.extractInfoFromToken(token);
            let [, id,] = data_from_token;
            return await User.findById(id);
        } catch (e) {
            return null
        }
    }

    async updateUserProfile(token, data) {
        try {
            let data_from_token = await this.extractInfoFromToken(token);
            let [, id,] = data_from_token;
            return await User.updateOne({_id: id}, data);
        } catch (e) {
            return null
        }
    }

    async extractInfoFromToken(token) {
        let decoded = jwt.verify(token, 'loginccqq');
        return [decoded.username, decoded.id, decoded.isAdmin];
    }

    transporter = nodemailer.createTransport(sendGridTransport({
        service: 'gmail',
        auth: {
            api_key: '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'
        }
    }));

    async forgotPassword(req, email) {
        let resetLink
        const user = await User.findOne({"username": email});
        if (!user) {
            return "user not found";
        } else {
            const code = crypto.randomBytes(1).toString('hex');
            let token = jwt.sign({code}, 'resettoken', {expiresIn: '60m'});

            if (user.isAdmin === true) {
                resetLink = `http://${req.headers.host}/admin/resetPassword/${token}`;
            } else {
                resetLink = `http://${req.headers.host}/website/resetPassword/${token}`;
            }

            const mailOptions = {
                from: '0xalameda@gmail.com',
                to: email,
                subject: 'Reset your password',
                html: `
                        <h1 style="text-align: center;">Blood Bank</h1><p>Please click the following link to reset your password:</p>
                        <a href=${resetLink}>${resetLink}</a>
                        <p style="opacity: 0.9;">Best regards,</p>
                        <p style="opacity: 0.9;">Your Website Team</p>
                        `
            };

            try {
                await this.transporter.sendMail(mailOptions);
                return {
                    message: 'Email sent',
                    resetLink: resetLink
                };
            } catch (error) {
                console.error(error);
                return 'Error sending email';
            }
        }
    }

    async resetPassword(resetToken, username, newPassword) {
        try {
            const user = await User.findOne({"username": username});
            if (!user) {
                return "The user not found";
            } else {
                try {
                    let decoded = jwt.verify(resetToken, "resettoken");
                    newPassword = await bcrypt.hash(newPassword, 10);
                    return User.updateOne({"username": username}, {password: newPassword});
                } catch (e) {
                    return null
                }
            }
        } catch (e) {
            return null;
        }
    }

    async changePassword(username, oldPassword, newPassword) {
        try {
            const user = await User.findOne({"username": username});
            if (!user) {
                return "The user not found";
            } else {
                if (await bcrypt.compare(oldPassword, user.password)) {
                    newPassword = await bcrypt.hash(newPassword, 10);
                    return User.updateOne({"username": username}, {password: newPassword});
                } else {
                    return "The old password wrong";
                }
            }
        } catch (e) {
            return null;
        }
    }

    async accountVerification(token) {
        try {
            let data_from_token = await this.extractInfoFromToken(token);
            let [, id,] = data_from_token;
            let user = await User.findById(id);
            if (!user) {
                return "user not found";
            } else {
                return await User.updateOne({_id: id}, {verified: true});
            }
        } catch (e) {
            return null
        }
    }
}

module.exports = {
    UserService
}