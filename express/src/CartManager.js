import { existsSync, promises } from "fs";
import { ProductManager } from "./ProductManager.js";

import { join } from "path";
import __dirname from "../../utils.js";

let archivo = join(__dirname, "/archivos/products.json");

const productManager2 = new ProductManager(archivo);

export class CartManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  //Consigo los carts /////
  async getCartsAsync() {
    if (existsSync(this.path)) {
      return JSON.parse(await promises.readFile(this.path, "utf-8"));
    } else {
      return [];
    }
  }

  //Agrego un cart /////
  async addCartAsync(products) {
    let carts = await this.getCartsAsync();
    let productos = await productManager2.getProductsAsync();

    console.log(products);
    let [data] = products;
    let productId = data.productId;

    // valido si el productId existe en el array de productos////////
    let existeProducto = productos.find((producto) => {
      return producto.id === productId;
    });
    if (!existeProducto) {
      console.log(`El usuario con producto = ${productId} no existe`);
      return;
    }

    let id = 1;

    if (carts.length > 0) {
      id = carts[carts.length - 1].id + 1;
    }

    let cart = {
      id: id,
      products: products,
    };

    carts.push(cart);
    await promises.writeFile(this.path, JSON.stringify(carts, null, 5));
    return cart;
  }

  async addCartProductAsync(cid, pid, productAgregar) {

    
    let carts = await this.getCartsAsync();

    let { productId, qty } = productAgregar;
    console.log(productId);
    console.log(qty);
    console.log(productAgregar);

    let indice = carts.findIndex((cart) => {


      // Buscamos un indice del carrito
      return cart.id === cid;
    });

    console.log(indice);

    //comprobamos si el producto Existe

    let existProduct = carts[indice].products.find((productoid) => {
      return productoid.productId === pid;
    });

    console.log(existProduct);

    if (existProduct) {
      existProduct.qty += qty;
    } else {
      carts[indice].products.push({
        productId,
        qty,
      });
    }

    await promises.writeFile(this.path, JSON.stringify(carts, null, 5));
    return carts;
  }

  //devuelvo carts por ID //////
  async getCartByIdAsync(id) {
    let carts = await this.getCartsAsync();

    let indice = carts.findIndex((cart) => {
      return cart.id === id;
    });
    if (indice === -1) {
      console.log(`El cart con id ${id} no existe  Not Found`);
      return;
    }

    return carts[indice];
  }
}