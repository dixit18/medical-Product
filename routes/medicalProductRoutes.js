const express = require('express');
const uploadPhoto = require("../middleware/uploadPhoto")
const validateToken = require("../middleware/validateToke")

const MedicalproductController = require('../controller/medicalProductController')


const router = express.Router()
router.route('/')
        .get(MedicalproductController.getAllProduct)
        .post(validateToken,uploadPhoto,MedicalproductController.createProduct)


module.exports = router;