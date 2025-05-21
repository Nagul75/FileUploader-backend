const Router = require('express')
const folderController = require('../controllers/folderController')

//not implemented yet
//const userController = require('../controllers/userController')
//const fileController = require('../controllers/fileController')

const apiRouter = Router()

//apiRouter.get("users/:id/folders/:id", folderController.readFolderGET)
apiRouter.post("/users/:id/folders", folderController.createFolderPOST)
//apiRouter.delete("users/:id/folders/:id", folderController.deleteFolderDELETE)
//apiRouter.put("users/:id/folders/:id", folderController.updateFolderPUT)

module.exports = apiRouter