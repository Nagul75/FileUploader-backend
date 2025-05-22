const {body, validationResult} = require('express-validator')
const {PrismaClient} = require('../generated/prisma')

const prisma = new PrismaClient()

validateFolder = [
    body("name").trim()
     .isLength({min: 1, max: 20}).withMessage("Folder names must be between 3 and 20 characters")
]

const readFolderGET = async (req, res) => {
    const user_id = req.params.user_id;
    const parent_id = req.params.folder_id;

    try {
        const children = await prisma.folder.findMany({
            where: {
                userId: Number(user_id),
                parent_id: Number(parent_id)
            },
        });
        if(!children) {
            return res.status(400).json({success: false, message: "Error retrieving folder info"});
        }
        return res.status(200).json({success: true, children: children});
    }
    catch(err) {
        return res.status(500).json({success: false, message: err.message || "Internal server error"});
    }
}

const createFolderPOST = [
    validateFolder,
    async (req, res) => {
        const user_id = req.params.user_id
        const parent_id = req.query.parent_id
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array })
        }
        try {
            const folder = await prisma.folder.create({
                data: {
                    name: req.body.name,
                    parent_id: Number(parent_id),
                    userId: Number(user_id),
                }
            })
            if(!folder) {
                throw new Error("Error creating file!")
            }
            res.status(201).json({success: true, message: "Folder has been created!"})
        } catch(err) {
            return res.status(500).json({success: false, message: err.message || "Something went wrong!"})
        }
    }
]

//only do edit of file name
const updateFolderPUT = (req, res) => {

}

const deleteFolderDELETE = (req, res) => {

}

module.exports = {
    readFolderGET,
    createFolderPOST,
    updateFolderPUT,
    deleteFolderDELETE
}


