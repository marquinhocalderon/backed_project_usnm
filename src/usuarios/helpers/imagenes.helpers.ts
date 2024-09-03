import { BadRequestException } from "@nestjs/common";

// renameImage.ts
export const nombreComoSeGuarda = (req, file, cb) => {
    // Genera un nombre único para el archivo
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    
    // Sanitiza el nombre original del archivo para eliminar espacios y caracteres no deseados
    const sanitizedOriginalName = file.originalname.replace(/\s/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Crea el nombre final del archivo con el sufijo único
    const filename = `${uniqueSuffix}-${sanitizedOriginalName}`;
    
    // Llama a la función de callback con el nuevo nombre de archivo
    cb(null, filename);
  };


export const validarTipodeArchivoGuardar = (req, file, cb) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Formato de imagen no válido. Por favor, proporciona una imagen en formato JPG, JPEG, PNG o GIF..'), false);
  }
} 


// export const validarElPesodelaImagen = (req, file, cb) => {
//   const MAX_SIZE_MB = 10; // Tamaño máximo en MB
//   const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Convertir MB a bytes

//   if (file.size <= MAX_SIZE_BYTES) {
//     cb(null, true);
//   } else {
//     cb(new BadRequestException('El tamaño de la imagen es demasiado grande. Por favor, proporciona una imagen de menos de 10 MB.'), false);
//   }
// };
  