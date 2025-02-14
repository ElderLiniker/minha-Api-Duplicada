import * as yup from "yup"
import User from "../models/User"
import jwt from "jsonwebtoken"
import authConfig from "../../config/auth"

class SessionController {
    async store(request,response){
const schema = yup.object({
email: yup.string().email().required(),
password: yup.string().min(6).required(),

})
const isValid = await schema.isValid(request.body)

const  userorpasswordwordincorrect   = () =>{
   response.status(401).json({error:"Make sure ypur email or password correct"});

}

if (!isValid) {
   return userorpasswordwordincorrect()
    
}

      const {email, password}= request.body

      const user = await User.findOne({

        where:{
            email,
        }
      })
      if (!user) { 
       return userorpasswordwordincorrect()
      }
const isSamepassword = await user.checkpassword(password);

if (!isSamepassword) {
 return userorpasswordwordincorrect()
  
}

      return response.status(201).json({ 
        id: user.id,
        name: user.name, 
        email,
        admin: user.admin,
        token: jwt.sign({id:user.id, name:user.name}, authConfig.secret, {
          expiresIn:authConfig.experesIn,
        })

      })

    }
}

export default new SessionController()