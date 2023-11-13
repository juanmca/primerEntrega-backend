

import { Router } from "express";
export const router = Router();

import { join } from "path";
import __dirname from "../../../utils.js";

import { ProductManager } from "../ProductManager.js";

let archivo = join(__dirname, "/archivos/products.json");

console.log(archivo);

const productManager = new ProductManager(archivo);

// Ruta para obtener todos los productos (con opción de limitar resultados)
router.get("/", async (req, res) => {
  // Obtiene los productos y aplica un límite si se proporciona
  let resultado = await productManager.getProductsAsync();

  if (req.query.limit) {
    resultado = resultado.slice(0, req.query.limit);
  }

  // Configura la cabecera de la respuesta como JSON y envía la respuesta
  res.setHeader("Content-type", "application/json");
  return res.status(200).json({ filtros: req.query, resultado });
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  // Obtiene el parámetro pid de la URL y lo convierte a entero
  let { pid } = req.params;
  pid = parseInt(pid);

  // Verifica si el ID es numérico
  if (isNaN(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .send({ error: "Error, ingrese un argumento id numerico" });
  }

  // Obtiene el producto por su ID y envía la respuesta
  let resultado = await productManager.getProductByIdAsync(pid);

  if (!resultado) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).send({ error: `Error, No existe el id ${pid}` });
  }

  res.setHeader("Content-type", "application/json");
  return res.status(200).json({ filtros: req.params, resultado });
});

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
  // Obtiene los datos del cuerpo de la solicitud
  let {
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status,
  } = req.body;

  // Valida la existencia de datos obligatorios
  if (!title || !description || !price || !code || !stock || !category) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `Los datos title, description, price, code, stock, category y status son obligatorios`,
    });
  }

  // Agrega un nuevo producto y envía la respuesta
  let resultado = await productManager.addProductAsync(
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    status
  );

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ resultado });
});

// Ruta para actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
  // Obtiene el parámetro pid de la URL y lo convierte a entero
  let { pid } = req.params;
  pid = parseInt(pid);

  // Verifica si el ID es numérico
  if (isNaN(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese un id numerico` });
  }

  // Define las propiedades permitidas para actualizar
  let propsPermitidas = [
    "title",
    "description",
    "price",
    "thumbnails",
    "code",
    "stock",
    "category",
    "status",
  ];

  // Obtiene las propiedades que llegan en la solicitud
  let propsQueLlegan = Object.keys(req.body);

  // Compara las propiedades que llegan con las permitidas
  let valido = propsQueLlegan.every((propiedad) => {
    return propsPermitidas.includes(propiedad);
  });

  // Si hay propiedades no permitidas, envía un error
  if (!valido) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `No se aceptan algunas propiedades`,
      propsPermitidas,
    });
  }

  // Actualiza el producto y envía la respuesta
  let resultado = await productManager.updateProductAsync(pid, req.body);

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ resultado });
});

// Ruta para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
  // Obtiene el parámetro pid de la URL y lo convierte a entero
  let { pid } = req.params;
  pid = parseInt(pid);

  // Verifica si el ID es numérico
  if (isNaN(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese un id numerico` });
  }

  // Elimina el producto y envía la respuesta
  let resultado = await productManager.deleteProductAsync(pid);

   // Verifica si el producto fue eliminado con éxito
   if (!resultado) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `No existe el producto con id ${pid}` });
  }

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ message: "Producto Borrado", resultado });
});