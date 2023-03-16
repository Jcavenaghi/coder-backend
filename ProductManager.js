class ticketManager {
    #privada
    constructor() {
        this.products = [
            // {   code: 0,
            //     id: 0,
            //     title: '',
            //     description: '',
            //     price: '',
            //     thumbnail: '',
            //     stock: ''   },
            // {   code: 0,
            //     id: 0,
            //     title: '',
            //     description: '',
            //     price: '',
            //     thumbnail: '',
            //     stock: ''   }
        ]
    }

    /* Metodos */
    addProduct = (producto) => {
        if (!this.products.some (prod => prod.code === producto.code)) {
            let valores = Object.values(producto)
            let camposLlenos = valores.every(valor => !!valor)
            /*el método !!valor se utiliza para convertir el valor en un booleano 
            y asegurarse de que se considere como vacío cualquier valor que sea null
            , undefined, false, 0 o una cadena vacía ''. */
            if (camposLlenos) {
                let prod = { id: this.#generarId(), ...producto}
                this.products.push(prod)
                return console.log(`Agregado el producto con id: ${prod.id}`)
            } else {
                return console.log("al menos un campo esta vacio.")
            }
            
        } else {
            return console.log("Ya existe un producto con ese codigo.")
        }
    }

    getProducts = () => {
        return console.log(this.products)
    }


    getProductById = (id) => {
        if (this.products.some (prod => prod.id === id)) {
            let i = this.products.findIndex(prod => prod.id === id)
            return console.log(this.products[i])
        } else {
            return console.error("Not Found")
        } 
    }
    #generarId = () => {
        if (this.products.length === 0) {
            return 1
        } else {
            code = this.products[this.products.length - 1].code + 1
            return code
        }

    }
}

ticket =  new ticketManager();
ticket.getProducts()
ticket.addProduct({title:"producto prueba", description: "prueba", price:200, thumbnail:"sin img", code:"abc123", stock:25})
ticket.getProducts()
ticket.addProduct({title:"producto prueba", description: "prueba", price:200, thumbnail:"sin img", code:"abc123", stock:25})
ticket.getProductById(1)
ticket.getProductById(2)