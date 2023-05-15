const { Router } = require("express");
const { find } = require("../model/user.model");
const userModel = require("../model/user.model");
const productModel = require('../model/products.model')
const adminMdw = require("../middleware/admin.middleware");
const {createHash, isValidPass } = require("../utils/bcrypt");
const passport = require("passport");
const {generateJWT }= require("../utils/jwt")

const router = Router();

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: `logout Error`, body: err });
  });
});

router.post("/login",passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req, res) => {
  try {
    if(!req.user)return res.status(400).send({status:"error",error:"Invalid credentials"})

    req.session.user = {
      first_name : req.user.first_name,
      last_name : req.user.last_name,
      age:req.user.age,
      email:req.user.email
    };
     
    let email = req.session.user.email
    const token = await generateJWT({ email });
    
    return res
      .cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ message: "login success " });


 /*    const products = await productModel.find({}).lean();
    
    return res.render("products", { productos: products,
      first_name: req.session?.user?.first_name || user.first_name,
      email: req.session?.user?.email || email,
      rol: "usuario", 
      
    }); */
  } catch (error) {
    console.log(
      "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
      error
    );
  }
});

router.get("/current", passport.authenticate("jwt", { session: false }),
  // checkAuthJwt("jwt"), 
  async (req, res) => {
    console.log(" VALIDANDO REQ", req.user);
    return res.json({ message: `jwt en las cookies` });
  }
);

  router.get('/faillogin', (req,res)=>{
    res.send({error:"Failed login"})
  });
  
router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}), async(req,res)=>{
res.render('login');
})

router.get('/failregister',async(req,res)=>{
  console.log("Failed Strategy");
  res.send({error:"Failed"})
})

router.get('/github',passport.authenticate('github',{scope:['user,email']}), async(req,res)=>{

})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
  req.session.user = req.user;
  console.log('login succesfull');
 
  const products = await productModel.find({}).lean();
  
  return res.render("products", { productos: products,
    first_name: req.session.user.first_name,
   
    
    rol: "usuario", 
    
  });


})


module.exports = router;