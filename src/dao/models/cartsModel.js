import mongoose from 'mongoose';
const cartsSchema = new mongoose.Schema( 
/* export const cartsModel = mongoose.model('Carts', new mongoose.Schema( */
    {
        title: { type: String, required: true, unique: true }, 
        products: {
            type:[
                {
                    product:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }
            ]
        },
        status: { type: Boolean, default: true }
    }
);

cartsSchema.pre('findOne', function(){
    this.populate({
        path: 'products.product'
    })
})

export const cartsModel = mongoose.model('Carts', cartsSchema)