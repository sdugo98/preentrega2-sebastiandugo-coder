import mongoose from "mongoose"

const usersEsquema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email:{
            type: String, unique: true
        },
        age: Number,
        password: String,
        cart: {},
        rol: {type: String, default: 'user'}
    },
    {
        timestamps: {
            updatedAt: 'DateUltimateMod', createdAt: 'DateOn'
        }
    }, {strict:false}
)

/*  HACEMOS DOBLE POPULATE PARA PODER VER EL CARRITO POBLADO Y SUS PRODUCTOS TAMBIEN */
usersEsquema.pre('findOne', function () {
    this.populate({
        path: 'cart.cart',
        populate: {
            path: 'products.product',
            model: 'products'
        }
    });
});


export const userModel = mongoose.model('users', usersEsquema)