const cartModel = require("../model/cart.models")
const productModel = require('../model/products.model')

class CartDao {
    getCarts = async () => {
        try {
            const cartArr = await cartModel.find({});
            return cartArr
        } catch (error) { 
            console.log("🚀 ~ file: productManager.js:10 ~ ProductManager ~ getAllProducts= ~ error:", error)
            
        }
     };

     createCart = async () => {
        try {
            let newCart = {productos:[]}
            return await cartModel.create(newCart);

        } catch (error) {
            console.log("🚀 ~ file: cartManager.js:18 ~ CartManager ~ createCart= ~ error:", error)
            
        }
     }
     getCartById = async (cip) => {
        try {
            const cartById = await cartModel.findById({_id:cip})
            if(!cartById) return 'carrito no encontrado'
            return cartById
        } catch (error) {
            console.log("🚀 ~ file: cartManager.js:28 ~ CartManager ~ getCartById= ~ error:", error)
            
        }
     }
    async addProduct(cid,pid){
        try {
            let product = await productModel.findById({_id:pid});
            if(product == null) return 'carrito no encontrado';
            
            let cart = await cartModel.findById({_id:cid});
            if(cart == null) return 'carrito no encontrado'

            const result = cart.products.find(prod => prod.product == pid)
            if(!result){
                cart.products.push({product:pid,quantity:1})
            } else {result.quantity += 1}
             const resultado = await cartModel.updateOne({_id:cid},cart)
             return "Producto agregado al carrito"
           
           
        } catch (error) {
            console.log("🚀 ~ file: cartManager.js:41 ~ CartManager ~ addProduct ~ error:", error)
            
        }
     }
     async deleteProduct(cid,pid){
        try {       
            let cart = await cartModel.findById({_id:cid});
            const result = cart.products.find(prod => prod.id == pid)
            if(!result){
                return 'el producto no existe'
            } else if(result.quantity > 1) {result.quantity -= 1} 
            else {
                let indexId = cart.products.findIndex(product => product.id == pid)
                cart.products.splice(indexId,1)
            }
             const resultado = await cartModel.updateOne({_id:cid},cart)
             return resultado
           
           
        } catch (error) {
            console.log("🚀 ~ file: cartManager.js:41 ~ CartManager ~ addProduct ~ error:", error)
            
        }
     }

     async purchase(cid){
        try {
            let cart = await cartModel.findById({_id:cid});

            let producto 
            let stock = await productModel.findById({_id:id});
            
        } catch (error) {
            
        }
     }
}

module.exports = CartDao;