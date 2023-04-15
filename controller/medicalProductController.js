const MedicalProduct = require('../models/medicalProductModel')
const productTypeModel = require('../models/productTypeModel');
const { Error } = require('mongoose');
const myError = require('../utils/Apperror');
const User = require('../models/userModel')
const Apperror = require('../utils/Apperror');
const medicalProductModel = require('../models/medicalProductModel');
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        const objectId = new ObjectId(id);
        return objectId.equals(id);
    }
    return false;
}


const createProduct = async (req,res, next)=>{
    const {name, productType, expiryDate} = req.body
    const imageFiles = req.files["image"]
    try{
        const proType = await productTypeModel.findOne({name: productType})
        console.log(!proType)
        if(!proType) {
            // console.log("Product")
            return next(new Apperror("Product type does not exist",400))
        }
        
const alreadyExists = await MedicalProduct.findOne({name:name})
if(alreadyExists) return next(new Apperror("Product already exists"))
        const newProduct =  new MedicalProduct({
            name, 
            productType: proType._id,
            image: (imageFiles.map((file) => file.filename)).toString(),
            expiryDate,
            user:req.user.id
        })
        // console.log(newProduct)
        
      


        const product = await newProduct.save()

        res.status(201).json({
            status:'success',
            message:'Product successfully created',
            data:{
                product: product
            }
        })
    }catch(err){
        res.status(500).json({
            status:'fail',
            message:err,
    })
    }
}

const getAllProduct = async(req,res)=>{
    try{
        const products = await MedicalProduct.find()
        res.status(200).json({
            status:'success',
            data:{
                products
            }

        })
    }catch(err){
        res.status(500).json({
            status:'fail',
            message:err
        })
    }
}

const deleteProductById = async(req,res,next)=>{
    const id = req.params.id;
    if(!id) return next(new Apperror('id is not present in the parameter',400))
try{


    let productExist;
    if(isValidObjectId(id)){

        productExist = await MedicalProduct.findById(id);
    }else{
     return next(new Apperror("please provide a valid product id"))
    }


    // const productExist = await MedicalProduct.findById(id)

    if(!productExist) return next(new Apperror('Product does not exist',400))

    
    if(productExist.user.toString() !== req.user.id){
        return next(new Apperror(`user does not have permission to delete product`,401))
    }

    // const deleteOne = await MedicalProduct.deleteOne(productExist);
    productExist.isdeleted = true;
    const temp = await productExist.save()
    console.log(temp)
//    const data = await MedicalProduct.find({isdeleted:false})

//    console.log(data)
   res.status(200).json({
    status:'success',
msg:"successfully deleted"
   })
    // if(deleteOne){
    //     return res.status(200).json({
    //         message:'Product does not exist anymore'
    //     })
    // }else{
    //     return next(new Apperror('something went wrong while deleting product',500))
    // }
    
}catch(err){
    res.status(500).json({
        status:'fail',
        message:err
    })
}

}

const updateProduct = async(req,res,next)=>{

    const id = req.params.id;

    let ProductTypeID;
    const file = req.files;

const {name,productType,expiryDate} = req.body;

if(!id) return next(new Apperror('id is not present in the parameter',400))
try{

    let productExist;
        if(isValidObjectId(id)){
 
            productExist = await MedicalProduct.findById(id);
        }else{
         return next(new Apperror("please provide a valid product id"))
        }

    if(!productExist) return next(new Apperror('Product does not exist',400))
    
    console.log(req.user.id)

    if(productExist.user.toString() !== req.user.id){

        return next(new Apperror('you do not have permission to update this product',401))
    } 
 
    const productTypeExists = await productTypeModel.findOne({name:productType})
    // console.log("product type exists",productTypeExists)
    if(!productTypeExists){

        return next(new Apperror('this product type does not exist',400))
    } else{
        ProductTypeID = productTypeExists.id;
    }

    const updatedMedicalPoduct = await MedicalProduct.findByIdAndUpdate(id,{
        name,
        productType:ProductTypeID,
        expiryDate,
        image:file.filename
    },{
        new :true,
    })
   
    if (updatedMedicalPoduct) {
        return res.status(200).json({
          name,
          productType,
          updatedMedicalPoduct,
          msg: "Medical Product updated successfully",
        });
      } else{
        return next(new Apperror("Something went wrong", 500));
      }

}catch(err){
    res.status(500).json({
        message:'something went wrong while updating Product',
        err:err
    })
}

}

const getProductByType = async (req,res,next) =>{
    const id = req.params.id;

    if(!id) return next(new Apperror('Please specify id',400))
    try{
            const typeExists = await productTypeModel.findById(id);
            if(!typeExists) return next(new Apperror('Product type does not exist',))

        const MedicalProducts = await MedicalProduct.find({productType:id})
        if(MedicalProducts){
            res.status(200).json({
                status:'success',
                data: MedicalProducts
            })
        }else{
            return next(new Apperror('does not have any product with this type',400))
        }

    }catch(err){
        res.status(500).json({
            status:'fail',
            message:'something went wrong while getting product by type'
        })
    }



}

const getMostRecentProduct = async(req,res,next)=>{
    try{
        const recentProduct = await MedicalProduct.find({}).sort({createdAt:-1})
        res.status(200).json({
            status:'success',
            recentProduct
        })
    }catch(err){
        res.status(500).json({
            status:'fail',
            message:'something went wrong '
        })
    }
}


module.exports = {
    createProduct,
    getAllProduct,
    deleteProductById,
    updateProduct,
    getProductByType,
    getMostRecentProduct,
 
}
