"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
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
const upload = (folderName) => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                const path = `public/${folderName}`;
                fs_1.default.mkdirSync(path, { recursive: true });
                cb(null, path);
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + "-" + (0, moment_1.default)().format('DMMYY') + "_" + file.originalname);
            }
        })
    });
};
exports.default = upload;
