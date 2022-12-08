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
        await fsPromises.writeFile( 
            path.join(__dirname, '../../localDB' , 'users.json'), JSON.stringify(userDB.users));
    } catch (error) {
        throw new CustomException(500, 'Error while register process.');
    }
}


module.exports = {
    userRegisterController
};
  