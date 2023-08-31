export class CreateCartDto{
    constructor(items){
        this.items
    }
};

export class GetCartDto{
    constructor(cart){
        this._id = cart._id;
        this.items = cart.items;
    }
};