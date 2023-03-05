import BaseModel from "./BaseModel.js"
import PageModel from "./PageModel.js"
import RoleModel from "./RoleModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static get relationMappings() {
    return {
      pages: {
        modelClass: PageModel,
        relation: BaseModel.HasManyRelation,
        join: {
          from: ["users.id", "users.id"],
          to: ["pages.creatorId", "pages.modifiedBy"],
        },
      },
      roles: {
        modelClass: RoleModel,
        relation: BaseModel.BelongsToOneRelation,
      },
    }
  }
}

export default UserModel
