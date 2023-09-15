export class GetUserDto{
    constructor(userDB){
        this.email = userDB.email;
        this.name = userDB.first_name + " " + userDB.last_name;
        this.age = userDB.age
        this.role = userDB.role
        this.cartId = userDB.cartId
    }
};