const Apperror = require('../utils/Apperror');
const Comment = require('./../models/commentModel');
const MedicalProduct = require('./../models/medicalProductModel')
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        const objectId = new ObjectId(id);
        return objectId.equals(id);
    }
    return false;
}


const comment = async (req,res,next)=>{
    try{

        const id = req.params.id;
        
  
       let product;
       if(isValidObjectId(id)){

            product = await MedicalProduct.findById(id);
       }else{
        return next(new Apperror("please provide a valid product id"))
       }
       
        if(!product) return next(new Apperror("Product does not exist",403))

        const addComment = new Comment({
            comment:req.body.comment,
            user:req.user.id,
            product:product.id
        })
        const createComment = await addComment.save()

      

        if(createComment){

            res.status(201).json({
                status:'success',
                msg:'comment successfully added',
                comment: createComment
            })
        }
    }catch(err){
        res.status(500).json({
            status:'something went wrong while creating comment',
            msg:err
        })
    }


    
}

module.exports = {
    comment
}