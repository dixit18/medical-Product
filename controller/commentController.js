const Comment = require('./../models/commentModel');
const MedicalProduct = require('./../models/medicalProductModel')
const comment = async (req,res)=>{
    try{

        const id = req.params.id;
        const product = await MedicalProduct.findById(id);
        
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