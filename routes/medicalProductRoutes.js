const express = require('express');
const uploadPhoto = require("../middleware/uploadPhoto")
const validateToken = require("../middleware/validateToke")
const commentController = require("../controller/commentController")
const likeDislikeController = require("../controller/likeDislike")

const MedicalproductController = require('./../controller/medicalProductController')


const router = express.Router()
router.route('/')
        .get(MedicalproductController.getAllProduct)
        .post(validateToken,uploadPhoto,MedicalproductController.createProduct)

router.route('/:id').delete(validateToken,MedicalproductController.deleteProductById)

router.route('/comments/:id').post(validateToken,commentController.comment)

router.route('/updateMedicalProduct/:id').patch(
        validateToken,
        uploadPhoto,
        MedicalproductController.updateProduct
)

router.route('/getProductByType/:id').get(MedicalproductController.getProductByType)

router.route('/getMostRecentProduct').get(MedicalproductController.getMostRecentProduct)

router.route('/like/:id').post(validateToken,likeDislikeController.like)

router.route('/disLike/:id').post(validateToken,likeDislikeController.disLike)

router.route('/mostLikedProduct').get(likeDislikeController.mostLikedPRoduct)

router.route('/mostDislikeProduct').get(likeDislikeController.mostDislikedProduct)

module.exports = router;



