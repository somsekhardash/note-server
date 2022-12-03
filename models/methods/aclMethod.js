const { Roles } = require('.')

const ACL = class{
    constructor() {
        this.role_id = null
        this.permissions = {
            READ: false,
            WRITE: false,
            DELETE: false,
        }
    }
    async createACL(name) {
        const roleData = await Roles.find({ role_name: name })
        this.role_id = roleData[0]._id
    }

    setRoleReadAccess(value) {
        this.permissions = {
            ...this.permissions,
            READ: value,
        }
    }
    setRoleWriteAccess(value) {
        this.permissions = {
            ...this.permissions,
            WRITE: value,
        }
    }
    setRoleDeleteAccess(value) {
        this.permissions = {
            ...this.permissions,
            DELETE: value,
        }
    }
}

module.exports = ACL;
