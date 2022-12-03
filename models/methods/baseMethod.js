const  ACL  = require('./aclMethod')
const { Roles } = require('.')

const BaseMethod = class {
    constructor(model) {
        this.model = model
    }

    /**
     * function to set ACL
     * @param {ObjectID} docId object id of any document
     * @param {object} aclObj ACL object
     * @returns {object} updated document with ACL object added
     */

    async setACL(docId, aclObj) {
        const updatedDoc = await this.model.findByIdAndUpdate(
            docId,
            {
                $push: { ACL: aclObj },
            },
            {
                new: true,
                upsert: true,
            }
        )
        return updatedDoc
    }

    /**
     * function to pop the exisitng ACL from the array and push the new one ACL with updated permission
     * @param {ObjectID} docId object id of any document
     * @param {object} aclObj ACL object
     * @returns {object} updated document with ACL object added
     */

    async popAndUpdateACL(docId, aclObj) {
        await this.model.findByIdAndUpdate(docId, {
            $pull: { ACL: { role_id: aclObj.role_id } },
        })
        const updatedDoc = await this.setACL(docId, aclObj)
        return updatedDoc
    }

    /**
     * function to set super admin ACL
     * @param {ObjectID} docId object id of any document
     * @returns {object} creates and sets super admin ACL
     */

    async setSuperAdmin(docId) {
        const superAdminACL = new ACL()
        // await superAdminACL.createACL('superAdmin')
        // superAdminACL.setRoleReadAccess(true)
        // superAdminACL.setRoleWriteAccess(true)
        // superAdminACL.setRoleDeleteAccess(true)

        return await this.setACL(docId, superAdminACL)
    }

    /**
     * function to add user to role
     * @param {object} userData document of user
     * @param {ObjectID} roleID role id of user
     * @returns {object} add user inside user array in role
     */

    async addUserToRole(userData, roleID) {
        const updatedRole = await Roles.findByIdAndUpdate(
            roleID,
            {
                $push: { user: userData._id },
            },
            {
                new: true,
                upsert: true,
            }
        )
        return updatedRole
    }
}

module.exports = BaseMethod;
