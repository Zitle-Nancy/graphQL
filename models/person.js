import mongoose from "mongoose";
// te añade comentarios de error más limpios
import uniqueValidator from "mongoose-unique-validator";

/**
 * El Schema como lo dice su nombre nos sirve para generar los types
 * y podemos agregarle validaciones, como en este caso le decimos que
 * es único, requerido y su longitud mimina debe ser de cinco caracteres
 */

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  phone: {
    type: String,
    minLength: 5,
  },
  street: {
    type: String,
    required: true,
    minLength: 5,
  },
  city: {
    type: String,
    required: true,
    minLength: 5,
  },
});

schema.plugin(uniqueValidator);
export default mongoose.model("Person", schema);

/** uniqueValidator
 * Su objetivo principal es generar mensajes de error más amigables
 * Y haver validas las validaciones
 */
