import express, { urlencoded } from "express";
import { router as routerProducts } from "./routes/products-router.js";
import { router as routerCarts } from "./routes/carts-router.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

const entorno2 = async () => {
  let server;

  try {
    app.use("/api/products", routerProducts);
    app.use("/api/carts", routerCarts);

    app.get("/", (req, res) => {
      console.log("Solicitud recibida en la ruta principal ('/'):", req);
      res.setHeader("Content-Type", "text/html");
      res.status(200).send("Hola soy un Server Express");
    });

    server = app.listen(PORT, () => {
      console.log(
        `Servidor en linea en puerto ${PORT}  - ¡Listo para recibir solicitudes!`
      );
    });
  } catch (error) {
    console.log("Se ha encontrado el siguiente error", error.message);
  }
};

entorno2();
