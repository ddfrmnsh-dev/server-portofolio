import multer from'multer';
import fs from 'fs';
import moment from 'moment';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // const {ds} = req.body
//         const path = `./public/uploads`
//         fs.mkdirSync(path, { recursive: true })
//         cb(null, path)
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "-" + moment().format('DMMYY') + "_" + file.originalname)
//     }
// })
// const upload = multer({})
const upload = (folderName:any) =>{
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
            const path = `./public/uploads/${folderName}`
            fs.mkdirSync(path, { recursive: true })
            cb(null, path)
            },
            filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + moment().format('DMMYY') + "_" + file.originalname)
            }
        })
      })
}

export default upload;
