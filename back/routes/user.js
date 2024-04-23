const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const nodemailer = require('nodemailer');
const multer = require ('multer');

router.get('/usersByDeveloper/:namedeveloppeur', async (req, res) => {
  try {
      const { namedeveloppeur } = req.params;
      const users = await User.find({ namedeveloppeur });
      res.json(users);
  } catch (error) {
      console.error('Error retrieving users by developer:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
     data = req.body;
   user = await User.findOne({ email: data.email });

    if (!user) {
        res.status(404).send('Email or password invalid!');
    } else {
        const validPass = bcrypt.compareSync(data.password, user.password);
        if (!validPass) {
            res.status(401).send('Email or password invalid!');
        } else {
            const payload = {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            };
            const token = jwt.sign(payload, 'CVNHFFTYJK');
            res.status(200).send({ mytoken: token });
        }
    }
});

router.post('/exist', async (req, res) => {
    try {
        data = req.body;
       existingUser = await User.findOne({ email: data.email });
        res.send({ exists: !!existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
     data = req.body;
     user = new User(data);
     salt = bcrypt.genSaltSync(10);
     cryptedPass = await bcrypt.hashSync(data.password, salt);

     user.password = cryptedPass;
     user.save()
        .then((saved) => {
            res.status(200).send(saved);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.post('/forgot-password', (req, res) => {
    const {email }= req.body;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
         token = jwt.sign({id: user._id}, 'CVNHFFTYJK', {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rymahammami42@gmail.com',
              pass: 'iqme wwtc abmg sbqm'
            }
          });
          
          var mailOptions = {
            from: 'rymahammami42@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3001/resetPass/${user._id}/${token}`

          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
});
router.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, "CVNHFFTYJK", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                User.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
});

router.get('/logout', (req,res)=>{
    res.clearCookie('token')
    return res.json({status: true})
});

router.get('/allUsers', (req, res) =>{
    User.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
});


router.put('/updateRole/:userId', async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating user role.' });
    }
  });

  router.get('/usersWithoutRoles', async (req, res) => {
    try {
      const usersWithoutRoles = await User.find({ role: null });
      res.json(usersWithoutRoles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving users without roles.' });
    }
  });
// Get users with roles
router.get('/usersWithRoles', async (req, res) => {
    try {
      const usersWithRoles = await User.find({ role: { $exists: true, $ne: null } });
      res.json(usersWithRoles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving users with roles.' });
    }
  });

  //create User
  router.post("/create", (req, res)=> {
    User.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
  });

  router.get('/getUser/:id', (req,res)=>{
    const id = req.params.id;
    User.findById({_id: id})
    .then(users => res.json(users))
    .catch(err => res.json(err))
  });

  //update
router.put('/update/:id',async ( req, res) =>{
  const id = req.params.id;
  User.findByIdAndUpdate({_id:id},
     {name: req.body.name, 
      email: req.body.email,
      address: req.body.address, 
      phone: req.body.phone, 
      domaine: req.body.domaine})
  .then(users => res.json(users))
    .catch(err => res.json(err))
});


//delete

router.delete('/delete/:id', (req,res) => {
  const id = req.params.id;
  User.findByIdAndDelete({_id: id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
});
//profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    // Assuming user has a role property
    if (user.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});


 



module.exports = router;