import { existsSync, promises } from "fs";

export class ProductManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  //Consigo los productos ///
  async getProductsAsync() {
    if (existsSync(this.path)) {
      return JSON.parse(await promises.readFile(this.path, "utf-8"));
    } else {
      return [];
    }
  }

  //Agrego  producto //////
  async addProductAsync(
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = true
  ) {
    let productos = await this.getProductsAsync();

    // validar si el code existe/////
    let existCode = productos.find((producto) => {
      return producto.code === code;
    });
    if (existCode) {
      console.log(`El usuario con code = ${code} ya existe`);
      return `El usuario con code = ${code} ya existe`;
    }

    let id = 1;

    if (productos.length > 0) {
      id = productos[productos.length - 1].id + 1;
    }

    let producto = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnails: thumbnails,
      code: code,
      stock: stock,
      category: category,
      status: status,
    };

    productos.push(producto);
    await promises.writeFile(this.path, JSON.stringify(productos, null, 5));
    return producto;
  }

  //devuelvo producto porID //////
  async getProductByIdAsync(id) {
    let productos = await this.getProductsAsync();

    let indice = productos.findIndex((producto) => {
      return producto.id === id;
    });
    if (indice === -1) {
      console.log(`No existe el producto con id ${id}  Not Found`);
      return;
    }

    return productos[indice];
  }

  //Elimino producto////

  async deleteProductAsync(id) {
    let productos = await this.getProductsAsync();

    //Busco  si  existe indice////

    let indice = productos.findIndex((producto) => {
      return producto.id === id;
    });
    if (indice === -1) {
      console.log(`El producto con id ${id} no existe  Not Found`);
      return;
    }

    let productoeliminado = productos.splice(indice, 1);

    await promises.writeFile(this.path, JSON.stringify(productos, null, 5));
    return productoeliminado;
  }

  //Actualizo producto////
  async updateProductAsync(id, objeto) {
    let productos = await this.getProductsAsync();

    //Busca si existe el indice///

    let indice = productos.findIndex((producto) => {
      return producto.id === id;
    });
    if (indice === -1) {
      console.log(`El producto con id ${id} no existe   No existe`);
      return ` El producto con id ${id} no existe   No existe`;
    }

    //Validacion de objeto///

    //Corroboro si es un objeto///

    const comprobarObj = (obj) => {
      return obj === Object(obj);
    };

    const objComprobado = comprobarObj(objeto);

    if (!objComprobado) {
      console.log("no es un objeto");
      return;
    }

  
    //valida que un objeto no sea vacio

    const camposObjLlenos = (obj) => {
      if (Object.values(obj).length === 0) {
        console.log("Ingrese al menos un campo, con su valor ");
        return;
      }
    };

    camposObjLlenos(objeto);

   
    //validacion  ingreso de campos  correctos/////

    const claves = Object.keys(objeto);

    const keyMasters = Object.keys(productos[0]);

    try {
      claves.forEach((datoObj) => {
        let dato = keyMasters.includes(datoObj);

        if (!dato) {
          console.log(`CAMPO INEXISTENTE ${datoObj}`);
          throw `Error de campo`;
        
        }
      });
    } catch (error) {
      console.log(error.message);
    }
    //*********************** //

    productos[indice] = {
      ...productos[indice],
      ...objeto,
      id,
    };

    await promises.writeFile(this.path, JSON.stringify(productos, null, 5));
    return productos[indice];
  }
}