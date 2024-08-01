import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';
import nodemailer from 'nodemailer';
import { config } from './config/config.js';
import {fakerES_MX as faker} from '@faker-js/faker';
import swaggerJsdoc from 'swagger-jsdoc'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname

export const hashPassword = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const validatePassword = (password, hashPassword) =>bcrypt.compareSync(password, hashPassword)

export const validatePasswordAsync = async (password, hashPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error:`Error 500 Server failed unexpectedly at validatePasswordAsync, please try again later`,
            message: `${error.message}`
        })
    }
};


export const passportCallError = (estrategia) =>{
    return function (req,res,next){
        passport.authenticate(estrategia,function(err,user,info,status){
            if(err) {return next(err)} 
            if(!user) { 
                res.setHeader('Content-type', 'application/json');
                return res.status(401).json({
                    error: info.message?info.message:info.toString()
                })
            } 
            req.user=user; 
            return next()
        })(req,res,next);
    }
}

export const uniqueTicketCode = (user)=>{

    const nameCode = user.first_name.slice(0,2).toUpperCase()
    const lastnameCode = user.last_name.slice(0,2).toUpperCase()
    const dateTimeCode = new Date().toISOString().replace(/[-:.TZ]/g, '')

    const uniqueCode = `${nameCode}${lastnameCode}${dateTimeCode}`

    return uniqueCode
}

const transporter=nodemailer.createTransport(
    {
        service:"gmail",
        port:"587", 
        auth:{
            user: config.GMAIL_EMAIL, 
            pass: config.GMAIL_PASS
        }
    }
)

export const sendEmail=async(de,para,asunto,mensaje)=>{
    return await transporter.sendMail(
        {
            from:de,
            to:para,
            subject:asunto,
            html:mensaje,
        }
    )
}



export const generateMockProduct=()=>{
    const categories=['senderismo', 'escalada', 'buceo', 'ciclismo']

    const mockProduct={
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price({min:30, max:120}),
        code:faker.number.int({min:10000,max:99999}),
        status: true,
        category: categories[Math.floor(Math.random()*categories.length)],
        thumbnails:faker.image.urlPicsumPhotos({}),
        createdAt:faker.date.anytime({}),
        updatedAt:faker.date.anytime({}),
        __v:0,        
    }

    mockProduct.id=mockProduct._id

    return mockProduct
}

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Ecommerce Documentation',
        version: '1.0.0',
        description: 'Documentación de la API del Proyecto de Backend E-Commerce Coderhouse',
      },
      // servers: [
      //   {
      //     url: 'http://localhost:3000',
      //   },
      // ],
    },
    apis: ['./src/docs/*.yaml'], 
  };

  export const specs = swaggerJsdoc(options);
 

//future development
// export const ROLES = Object.freeze({
//     admin: 'admin',
//     user: 'user',
//     premium: 'premium_user',
//     public: 'public'
// });
