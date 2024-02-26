const UserDetails = require('../../model/UserDetailsSchema')
const User = require('../../model/UserSchema');
  exports.GetUserProfileByEmail = async (req, res) =>{
    const {email ,username ,dateofbirth,bio,country,state ,city,address,phoneNo,picture } = req.body;
    try {
         
        const oldDetails = await UserDetails.findOne({email:email}).populate('userid')
        if(oldDetails) {
            oldDetails.bio =bio ?? oldDetails.bio;
            oldDetails.userid.username = username ?? oldDetails?.userid?.username;
            await oldDetails.save();
            await oldDetails.userid.save();
            return  res.status(200).json({ userDetails:oldDetails  });
        }

    } catch (err) {
     return res.status(500).json({ message: err.message });
    }
  }


  exports.FindUsersDetails = async (req, res) =>{
  
    try {
        const oldDetails = await UserDetails.find().populate('userid')
        if(oldDetails) {
           
            return  res.status(200).json({ userDetails:oldDetails , message :"User Find Successfully" });
        }
        else {
          return  res.status(500).json({ massage :"there is no user" });
        }

    } catch (err) {
     return res.status(500).json({ message: err.message });
    }
  }


exports.updateUserStatusByEmail = async (req, res) => {
  try {
    // const email = req.params.email;
    const { userStatus  , email} = req.body;

    const user = await User.findOneAndUpdate({ email }, { userStatus }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.updateDeleteStatusByEmail = async (req, res) => {
  try {
    console.log("hii delete")
    // const email = req.params.email;
    const { deleteStatus  , email} = req.body;

    const user = await User.findOneAndUpdate({ email }, { deleteStatus }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



