const Like = require('../models/likeModel')
const Dislike = require('../models/DislikeModel')
const MedicalProduct = require('../models/medicalProductModel')
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


const like = async (req,res,next)=>{
    try{
        const id = req.params.id
        let product;
        if(isValidObjectId(id)){
 
             product = await MedicalProduct.findById(id);
        }else{
         return next(new Apperror("please provide a valid product id"))
        }
    
        // const product = await MedicalProduct.findById(id)
       
        if (!product) return next(new Apperror("Product does not exists", 404));
    
    
        const isAlreadyLiked = await Like.findOne({
            user:req.user.id,
            product:product.id
        })
        // console.log(isAlreadyLiked)
        if (isAlreadyLiked) {
            return res.status(400).json({
              message: "You have already liked the product",
            });
          }
          const addLike = new Like({ user: req.user.id, product: product.id });
          const created = await addLike.save();

          if (created) {
            // deleting dislike
            await Dislike.findOneAndDelete({
              user: req.user.id,
              product: product.id,
            });
        
            res.json({
              msg: "U have successfully like the product",
            });
          } else {
            return next(new Apperror("Something went wrong", 500));
          }
        
    }catch(err){
        res.status(500).json({
            status:'fail',
            msg:err
        })
    }
}
const disLike = async(req,res,next)=>{
    const id = req.params.id;
    let product;
    if(isValidObjectId(id)){

         product = await MedicalProduct.findById(id);
    }else{
     return next(new Apperror("please provide a valid product id"))
    }

  // const product = await MedicalProduct.findById(id);

  if (!product) return next(new Apperror("Product does not exists", 403));

  const existingDislike = await Dislike.findOne({
    user: req.user.id,
    product: product.id,
  });

  if (existingDislike)
    return res.status(400).json({
      message: "Product already disliked by this user",
    });

  const addDislike = new Dislike({
    user: req.user.id,
    product: product.id,
  });
  const created = await addDislike.save();

  if (created) {
    // deleting like

    await Like.findOneAndDelete({
      user: req.user.id,
      product: product.id,
    });

    res.json({
      msg: "U have successfully dislike the product",
    });
  } else {
    return next(new Apperror("Something went wrong", 500));
  }
}
const mostLikedPRoduct = async(req,res,next) =>{

  const query = req.query.limit || 1
  if(isNaN(query)) return next(new Apperror("query must be a number"))

  const data = await Like.aggregate([
    {
      $group:{
        _id:"$product",
        count:{$sum: 1}
      },
    },
    {
      $sort: {count: -1}
    },
    {
      $limit: +query
    }
  ]).exec()

  // console.log(data)

  console.log(data)
  res.status(200).json({
    status:'success',
    data
  
  })
}
const mostDislikedProduct = async (req, res, next) => {
  const query = req.query.limit || 1;
  if (isNaN(query)) return next(new Apperror("Query must be a Number"));
  const data = await Dislike.aggregate([
    {
      $group: {
        _id: "$product",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: +query,
    }
  ]).exec();

  if (data) {
    res.json({
      output: data,
    });
  } else {
    return next(new Apperror("Something went wrong", 500));
  }
};



module.exports = {
    like,
    disLike,
    mostLikedPRoduct,
    mostDislikedProduct

}