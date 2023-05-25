import fs from 'fs'

import __dirname from '../../utils.js';
import cartModel from '../models/carts.js';

export default class CartManager {


  /* Hecho */
    getCart = async(cid) => {
      const result = await cartModel.findById(cid)
      .populate('items.product')
      .lean();
    return result;
    }

    addCart = async(items) => {
      const result = await cartModel.create(items);
      return result;
    }

    deleteProduct = async (cid, pid) => {
      const result = await cartModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { items: { product: pid } } },
            { new: true }
          )
          .then(cart => {
            if (cart) {
                return cart
              // El producto ha sido eliminado del carrito
            } else {
              throw new Error('No se encontro el carrito');
              // No se encontró el carrito con el ID especificado
            }
          })
          .catch(err => {
            throw new Error('Error al actualizar el carrito: ' + err.message);
            // Error al buscar y actualizar el carrito
          });
          return result;
    }

    deleteAllProducts = async (cid) => {
      const result = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $set: { items: [] } },
        { new: true }
      )
      .then(cart => {
        if (cart) {
          // El carrito se ha vaciado
          return cart;
        } else {
          // El carrito no existe
          throw new Error('el carrito no existe');
        }
      })
      .catch(err => {
        // Error al buscar y actualizar el carrito
        throw new Error('Error al actualizar el carrito: ' + err.message);
      });
    }


    updateCartById = async (cid, pid, quantity) => {
      try {
        const cart = await cartModel.findById(cid); // Obtener el carrito por su ID
        if (!cart) {
          throw new Error('El carrito no existe');
        }
    
        // Buscar el producto dentro del carrito
        const item = cart.items.find((item) => item.product.equals(pid));
        if (!item) {
          throw new Error('El producto no está en el carrito');
        }
    
        // Actualizar la cantidad del producto
        item.quantity = quantity;
    
        await cart.save(); // Guardar los cambios en el carrito actualizado
        return cart; // Opcional: devolver el carrito actualizado
      } catch (error) {
        throw new Error('Error al actualizar el carrito: ' + error.message);
      }
    }

    addProduct = async (cid, pid) => {
      try {
        const result = await cartModel.findOneAndUpdate(
            { _id: cid, 'items.product': pid }, // Busca un carrito que contenga el producto especificado
            { $inc: { 'items.$.quantity': 1 } }, // Incrementa la cantidad del producto en 1
            { new: true } // Retorna el documento actualizado
            )
            .then(cart => {
                if (cart) {
                    return cart;
                // El carrito no contiene el producto, por lo que lo agregamos
                } else {
                    cartModel.findOneAndUpdate(
                        { _id: cid },
                        { $push: { items: { product: pid } } },
                        { new: true }
                    )
                    .then(cart => {
                        return cart;
                        // El producto ha sido agregado al carrito
                    })
                    .catch(err => {
                        // Error al actualizar el carrito
                        throw new Error('error al actualizar el carrito: ' + err.message);
                    });
                    return cart
                // El producto ya existe en el carrito y su cantidad ha sido incrementada
                }
            })
            .catch(err => {
                // Error al buscar y actualizar el carrito
                throw new Error('Error al actualizar el carrito: ' + err.message);
            });
            return result
        } catch(error) {
          throw new Error("error"); 
        };
    }
    addProducts = async(cid, products) => {
      try {
        const cart = await cartModel.findById(cid); // Obtener el carrito por su ID
        if (!cart) {
          throw new Error('El carrito no existe');
        }
        cart.items = products.map((product) => ({
          product: product.product,
          quantity: product.quantity
        }));
    
        await cart.save(); // Guardar los cambios en el carrito actualizado
        return cart; // Opcional: devolver el carrito actualizado
      } catch(err) {

      }
    }
}