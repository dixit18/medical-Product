const express = require('express');
const productTypesController = require('../controller/productTypeController')
const validate = require('../middleware/validateToke')
const router = express.Router()

router.route('/')
            .get(productTypesController.getAllProductTypes)
            .post(validate,productTypesController.createProductType)


router.route('/:id').delete(validate,productTypesController.deleteProductType)
    module.exports = router