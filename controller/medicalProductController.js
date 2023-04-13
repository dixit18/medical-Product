const MedicalProduct = require('../models/medicalProductModel')
const productTypeModel = require('../models/productTypeModel');




// const createProduct = async (req, res, next) => {
//     const { name, productType,  expiryDate } = req.body;
//     let typeID;
//     const imageFiles = req.files["image"];
  
//     const productExists = await MedicalProduct.find({ name });
//     if (productExists.length > 0)
//       return next(new Error("Product Already Exists"));
  
//     const typeExists = await productTypeModel.findOne({ name: productType });
//     if (!typeExists) {
//       return next(new Error("This product type does not exists", 400));
//     } else {
//       typeID = typeExists._id;
//     }
  
//     const created = await MedicalProduct.create({
//       user: req.user.id,
//       name,
//       productType: typeID,
//       expiryDate,
//       image: (imageFiles.map((file) => file.filename)).toString(),
//     });
//     if (created) {
//       return res.status(200).json({
//         name,
//         productType,
//         msg: "Product created successfully",
//       });
//     } else {
//       return next(new Error("Something went wrong", 500));
//     }
//   };


const createProduct = async (req,res)=>{
    const {name, productType, expiryDate} = req.body
    const imageFiles = req.files["image"]
    const proType = await productTypeModel.findOne({name: productType})
    try{
        // console.log(proType)
        const newProduct =  new MedicalProduct({
            name, 
            productType: proType._id,
            image: (imageFiles.map((file) => file.filename)).toString(),
            expiryDate,
            user:req.user.id
        })
        const product = await newProduct.save()

        console.log(kedar)

        res.status(201).json({
            status:'success',
            message:'Product successfully created',
            data:{
                product: product
            }
        })
    }catch(err){
        res.status(500).json({
            status:'dixit',
            message:err
        })
    }
}
const getAllProduct = async(req,res)=>{
    try{
        const products = await MedicalProduct.find({}).populate('productType','name')
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

module.exports = {
    createProduct,
    getAllProduct,
}