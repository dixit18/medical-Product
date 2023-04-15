const ProductType = require('../models/productTypeModel')
const medicalProductModel = require('../models/medicalProductModel')
const Apperror = require('../utils/Apperror')
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        const objectId = new ObjectId(id);
        return objectId.equals(id);
    }
    return false;
}


const createProductType = async (req,res,next)=>{
    try{
const name = req.body.name

const exists = await ProductType.findOne({ name });
// console.log(exists)
if (exists) 
{
   
    return next(new Apperror("Product type already exists", 400))
};


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
        res.status(500).json({
            status:'success',
            message:err
        })
    }
}

const deleteProductType = async (req,res,next)=>{
        const id = req.params.id;

    if(!id) return next(new Apperror("Please provide an id",400))
    try{


        let productTypeExist;
        if(isValidObjectId(id)){
 
            productTypeExist = await ProductType.findById(id);
            console.log(productTypeExist)
        }else{
         return next(new Apperror("please provide a valid product id"))
        }



        // const productTypeExist = await ProductType.findById(id)
    
        if(!productTypeExist) return next(new Apperror('ProductType does not exist',400))
    
        if(productTypeExist.user.toString() !== req.user.id){
            return next(new Apperror(`user does not have permission to delete product`,401))
        }
        const MedicalProductExists = await medicalProductModel.findOne({productType:id})
    
        if(MedicalProductExists){
            return next(new Apperror('Medical Product exists you can not delete this product type',403))
    
        }else{
            const deleteOne = await ProductType.deleteOne(productTypeExist)
    
            if(deleteOne){
                return res.status(200).json({
                    status:'fail',
                    message:'Product Type does not exist anymore'
                })
            }else{
                return next(new Apperror('something went wrong while deleting this product type',500))
            }
        }
    }catch(err){
        res.status(500).json({
            status:"fail",
            message:err

        })
    }



}

module.exports = {
    createProductType,
    getAllProductTypes,
    deleteProductType
    
}