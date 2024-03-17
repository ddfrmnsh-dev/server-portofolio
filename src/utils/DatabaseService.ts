import mysql, { Pool } from 'mysql2'
import 'dotenv/config'
class DatabaseService {

    pool : Pool;
    _ready: boolean;

    constructor() {
    this._ready = false
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port : parseInt(process.env.DB_PORT ? process.env.DB_PORT : "3306"),
            connectionLimit : 100,
        })
    }

    beginDatabasePing() {
    }

    initialize() {
        console.log("INITING")
                this.beginDatabasePing()
    }

    query(sql : string, args? : any[]|any, logSql : boolean = false) : Promise<any> {
            return new Promise((resolve,reject) =>{

                this.pool.getConnection((err, connection)=>{
                    if (err) {
                        if(connection){
                            connection.release();
                        }
                        return reject(err)
                    }
                    
                    connection.query(sql,args,function(err,rows){
                        connection.release();
                        if(!err) {
                            return resolve(rows);
                        }else{
                            return reject(err)
                        }
                    });

                    connection.on('error', function(err) {
                        connection.release();
                        console.log("this also error")
                        return reject(err)
                    });

                })
            })
    }

}

export default new DatabaseService()
