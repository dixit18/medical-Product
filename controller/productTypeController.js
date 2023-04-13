const ProductType = require('../models/productTypeModel')


const createProductType = async (req,res)=>{
    try{
const name = req.body.name

const exists = await ProductType.findOne({ name });
if (exists) return next(new Error("Product type already exists", 400));


        const newProductType = await ProductType.create({
            name,
            user: req.user.id
        })

        res.status(201).json({
            status:'success',
            data:{
                data: newProductType
            }
        })
    }catch(err){
        res.status(500).json({
            status:'fail',
            message:err
        })
    }
}
const getAllProductTypes = async (req,res)=>{
    try{
        const productType = await ProductType.find({})
        res.status(200).json({
            status:'success',
            data:{
                productType
            }
        })
    }catch(err){

    }
}



module.exports = {
    createProductType,
    getAllProductTypes,
    
}