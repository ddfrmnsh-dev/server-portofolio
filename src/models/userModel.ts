
export interface IUser {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export default class User {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(user: IUser) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
    static desentizedUser(user: IUser): User {
        let du = new User(user)
        delete du.password
        return du
    }
}


