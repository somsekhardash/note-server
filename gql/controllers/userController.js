const userDB = {
    users: require('../../localDB/users.json'),
    setUsers: function(data) {this.users = data}
}

class CustomException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs'); 
const fsPromises = require('fs').promises;
const jwt = require('jsonwebtoken');


const userRegisterController = async (args, context) => {
    const {mobileNumber, passWord} = args;
    if(!mobileNumber || !passWord){
        throw new CustomException(400, 'No mobileNumber or password Found !!'); 
    }
    // check for duplicate entry
    const duplicateUser = userDB.users.find(user => user.mobileNumber == mobileNumber);
    if(duplicateUser)
        throw new CustomException(409, 'This UserID already Exists Found !!');
    try {
        const newPassword = await bcrypt.hash(passWord, 10);
        const newUser = {mobileNumber, newPassword};
        userDB.setUsers([...userDB.users, newUser]);        
        return await fsPromises.writeFile( 
            path.join(__dirname, '../../localDB' , 'users.json'), JSON.stringify(userDB.users)).then(() => {
                return {
                    status: true
                }
            }).catch(() => {
                return { status: false, token: null }
            });
    } catch (error) {
        throw new CustomException(500, 'Error while register process.');
    }
}


const userLoginController = async (args, context) => {
    const {mobileNumber, passWord} = args;
    if(!mobileNumber || !passWord){
        throw new CustomException(400, 'No mobileNumber or password Found !!'); 
    }
    const user = userDB.users.find(user => user.mobileNumber == mobileNumber);
    if(!user) {
        throw new CustomException(500, 'No user found');    
    }
    const passwordCheckResult = await bcrypt.compare(passWord, user.newPassword);
    if(!passwordCheckResult)
        throw new CustomException(409, 'Wrong password');
    try {
        var token = jwt.sign({ mobileNumber }, 'shhhhh', { expiresIn: 60 });
        var refreshToken = jwt.sign({ mobileNumber }, 'shhhhh', { expiresIn: 60 * 60 });
        user.refreshToken = refreshToken;
        
        const filteredUsers = userDB.users.filter(user => user.mobileNumber != mobileNumber);
        return await fsPromises.writeFile( 
            path.join(__dirname, '../../localDB' , 'users.json'), JSON.stringify([...filteredUsers,user])).then(() => {
                context.res.cookie("dashRefreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 60 * 60 * 1000),
                });
                return {
                    status: true,
                    accessToken: token
                }
            }).catch(() => {
                return { status: false, token: null }
            });       
    } catch (error) {
        throw new CustomException(500, 'Error userLoginController.');
    }
}

const userLogoutController = async (args, context) => {
    try {
        const {mobileNumber} = args;
        if(!mobileNumber){
            throw new CustomException(400, 'No mobileNumber or password Found !!'); 
        }
        const user = userDB.users.find(user => user.mobileNumber == mobileNumber);
        if(!user) {
            throw new CustomException(500, 'No user found');    
        }
        if(!user.refreshToken) {
            throw new CustomException(500, 'UnAuthorized');    
        }


    } catch (error) {
        
    }
}

const userRefreshController = async (args, context) => {
    try {
        const { token } = args;
        const user = userDB.users.find(user => user.refreshToken == token);
        if(!user) {
            throw new CustomException(500, 'No user found');    
        }
        const newToken = jwt.sign({ mobileNumber: user.mobileNumber }, 'shhhhh', { expiresIn: 60 });
        const refreshToken = jwt.sign({ mobileNumber: user.mobileNumber }, 'shhhhh', { expiresIn: 60 * 60 });
        user.refreshToken = refreshToken;
        const filteredUsers = userDB.users.filter(user => user.mobileNumber != mobileNumber);
        return await fsPromises.writeFile( 
            path.join(__dirname, '../../localDB' , 'users.json'), JSON.stringify([...filteredUsers,user])).then(() => {
                context.res.cookie("dashRefreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 60 * 60 * 1000),
                });
                return {
                    status: true,
                    accessToken: token
                }
            }).catch(() => {
                return { status: false, token: null }
            });       
    } catch (error) {
        throw new CustomException(500, 'Error userLoginController.');
    }
}


module.exports = {
    userRegisterController,
    userLoginController,
    userRefreshController,
    userLogoutController
};
  