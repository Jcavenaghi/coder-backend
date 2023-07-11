export const productCreateErrorInfo = (product) =>{
    return `
    Alguno de los campos para crear el producto no es valido:
    Lista de campos requeridos:
    title: Debe ser un campo string, pero recibio ${product.title}
    code: Debe ser un campo string, pero recibio ${product.code}
    description: Debe ser un campo string, pero recibio ${product.description}
    price: Debe ser un campo Number, pero recibio ${product.price}
    price: Debe ser un campo Number, pero recibio ${product.stock}
    category: Debe ser un campo String, pero recibio ${product.category}
    `
}

export const productCreatDuplicateErrorInfo = (code) =>{
    return `
    Se está intentado crear un producto existente: 
    code: Debe ser unico. pero recibio ${code}
    `
}

export const productGetErrorInfo = (sort, limit, page, query) =>{
    return `
    Alguno/s de el/los filtro/s para obtener productos no son validos:
    filtro sort: Debe ser un campo string (asc, desc), pero recibio ${sort}
    limit: Debe ser un integer, pero recibio ${limit}
    page: Debe ser un campo integer, pero recibio ${page}
    query: Debe ser una consulta para filtrar, pero recibio ${query}
    `
}

export const productUpdateErrorInfo = (pid, data) =>{
    return `
    No es posible actualizar el producto ${pid} con los campos ingresados: ${data}
    `
}

export const productIdErrorInfo = (pid) =>{
    return `
    Id del producto no valido. Debe ser un numero entero, pero se recibio: ${pid}
    `
}