import {hash as ahash, verify as averify} from 'argon2'

export class Hasher{
    static async hash(value:string){
        return await ahash(value);
    }
    static async verify(value:string, hashed:string){
        return averify(hashed,value)
    }
}