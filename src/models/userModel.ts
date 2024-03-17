export default class User {
    id?: number;
    name?: string;
    email?: string;
    password?: any;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(id?: number, name?: string, email?: string, password?: any, createdAt?: Date, updatedAt?: Date) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}