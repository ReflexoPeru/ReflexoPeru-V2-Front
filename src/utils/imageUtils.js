/**
 * Comprime una imagen sin perder calidad visual notable.
 * @param {File} file - El archivo de imagen original.
 * @param {Object} options - Opciones de compresión.
 * @returns {Promise<Blob>} - El blob de la imagen comprimida.
 */
export const compressImage = (file, { quality = 0.8, maxWidth = 1920, maxHeight = 1080 } = {}) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calcular nuevas dimensiones manteniendo el aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Crear un nuevo File a partir del blob para mantener el nombre original si es necesario
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Error al comprimir la imagen'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

/**
 * Convierte una ruta relativa del backend en una URL completa para mostrar en el frontend.
 * @param {string} path - La ruta de la imagen provista por el backend.
 * @returns {string} - La URL completa de la imagen.
 */
export const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('blob:')) return path;

    // El backend usa un endpoint específico para visualizar imágenes de reportes
    // URL esperada: TU_DOMINIO/api/help-reports/view-image/{nombre_archivo}
    const fileName = path.split('/').pop();
    const baseUrl = 'http://127.0.0.1:8001/api';

    return `${baseUrl}/help-reports/view-image/${fileName}`;
};
