import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static get relationMappings() {
    return {
      creatorId: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
      },
      modifiedBy: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
      },
    }
  }
}

export default PageModel
