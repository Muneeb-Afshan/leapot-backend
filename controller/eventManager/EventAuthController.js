const RegisterModel = require ('../../model/RegisterForm')

// Register User
exports.eventManagerSignUp= async (req, res) => { 
    RegisterModel.create(req.body) 
    .then(register => res.json (register)) 
    .catch(err => res.json(err))
}

exports.eventManagerSign = async (req, res) => { 
    const {email, password} = req.body;
    RegisterModel.findOne({email: email}) 
    .then(user => {
        if (user){
            if(user.password === password){
                res.json("Success")
            }else{
                res.json("The Password is incorrect")
            }
        } else {
            res.json("No record existed")
        }
     }) 
    .catch(err => res.json(err))
}
