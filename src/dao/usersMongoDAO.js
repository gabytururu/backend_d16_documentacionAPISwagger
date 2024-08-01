import { usersModel } from './models/usersModel.js'

export class UsersMongoDAO{

    async getAll(){
        return await usersModel.find().populate("cart").populate("tickets").lean()
    }

    async getOneBy(propFilter={}){
        return await usersModel.findOne(propFilter).populate("cart").populate("tickets.orderTicket").populate("productsOwned.ownedProduct").lean()
    }   

    async create(newUser){
        let newUserCreated= await usersModel.create(newUser)
        return newUserCreated.toJSON()
    }  

    async push(uid,itemToUpdate){
        let query;
        if(itemToUpdate.hasOwnProperty('purchaser')){
            let orderTicket = itemToUpdate
            query = {$push:{tickets:{orderTicket}}}
        }else{
            let ownedProduct = itemToUpdate
            query = {$push:{productsOwned:{ownedProduct}}}
        }

        return await usersModel.findByIdAndUpdate(
            uid,
            query,
            {runValidators:true, returnDocument:'after'}
        )
    }

    async remove(uid,ownedProduct){
        return await usersModel.findByIdAndUpdate(
            uid,
            {$pull:{productsOwned:{ownedProduct}}},
            {runValidators:true, returnDocument:'after'}
        )
    }

    async update(uid,updatedData){
        return await usersModel.findOneAndUpdate(
            uid, updatedData, { new: true }
        )
    }


    // async addTicketToUser(uid,orderTicket){
    //     return await usersModel.findByIdAndUpdate(
    //         uid,
    //         {$push:{tickets:{orderTicket}}},
    //         {runValidators:true, returnDocument:'after'}
    //     )       
    // }

    // async addProductToOwner(uid,ownedProduct){
    //     return await usersModel.findByIdAndUpdate(
    //         uid,
    //         {$push:{productsOwned:{ownedProduct}}},
    //         {runValidators:true, returnDocument:'after'}
    //     )
    // }
}