const Router = require('express')
const folderController = require('../controllers/folderController')

//not implemented yet
//const userController = require('../controllers/userController')
//const fileController = require('../controllers/fileController')

const apiRouter = Router()

apiRouter.get("/users/:user_id/folders/:folder_id", folderController.readFolderGET)
apiRouter.post("/users/:user_id/folders", folderController.createFolderPOST)
//apiRouter.delete("users/:user_id/folders/:folder_id", folderController.deleteFolderDELETE)
//apiRouter.put("users/:user_id/folders/:folder_id", folderController.updateFolderPUT)

module.exports = apiRouter