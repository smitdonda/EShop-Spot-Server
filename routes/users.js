var express = require("express");
var router = express.Router();
var { mongodb, MongoClient, dburl } = require("../dbSchema");
var {
  hashPassword,
  hashCompare,
  createToken,
  verifyToken,
} = require("../auth");

// sigup
router.post("/signup", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("users").find({ email: req.body.email });
    if (user.lenght > 0) {
      res.json({
        statusCode: 400,
        message: "User does not exist",
      });
    } else {
      let hashedPassword = await hashPassword(
        req.body.password,
        req.body.cpass
      );
      req.body.password = hashedPassword;
      req.body.cpassword = hashedPassword;
      let user = await db.collection("users").insertOne(req.body);
      res.json({
        statusCode: 200,
        message: "User SignUp Successfull",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});

// login
router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      let compare = await hashCompare(req.body.password, user.cpassword);
      if (compare) {
        let token = await createToken(user.email, user.username);
        res.json({
          statusCode: 200,
          email: user.email,
          username: user.username,
          token,
        });
      } else {
        res.json({
          statusCode: 400,
          message: "Invalid Password",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User Not Found",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});

// varify token
router.post("/auth", verifyToken, async (req, res) => {
  res.json({
    statusCode: 200,
    message: req.body.purpose,
  });
});

// ---------------------------------------------------------------------------------
router.post("/postproduct", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let products = await db.collection("products").insertMany(req.body);
    if (products) {
      res.json({
        statusCode: 200,
        products,
        message: "Products Data Post Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

//

router.get("/getproduct", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let brandName = await db.collection("products").find().toArray();
      res.json({
        statusCode: 200,
        brandName,
        message: "Products Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// home limit
// smartmobile
router.get("/getsmartmobile", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let products = await db
        .collection("products")
        .find({ keybrandname: "smartmobile" })
        .limit(4)
        .toArray();

      res.json({
        statusCode: 200,
        products: products,
        message: "Products Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/getsmarttv", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let products = await db
        .collection("products")
        .find({ keybrandname: "smarttv" })
        .limit(4)
        .toArray();
      res.json({
        statusCode: 200,
        products: products,
        message: "Products Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/gettws", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let products = await db
        .collection("products")
        .find({ keybrandname: "truewirelessstereobuds" })
        .limit(4)
        .toArray();
      res.json({
        statusCode: 200,
        products: products,
        message: "Products Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/getwatch", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let products = await db
        .collection("products")
        .find({ keybrandname: "smartwatches" })
        .limit(4)
        .toArray();
      res.json({
        statusCode: 200,
        products: products,
        message: "Products Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/getaccessories", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let products = await db
        .collection("products")
        .find({ keybrandname: "accessories" })
        .limit(4)
        .toArray();
      res.json({
        statusCode: 200,
        products: products,
        message: "Products Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

//find brandName
router.get("/getProductkeybrand/:keybrandname", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let query = {};
      if (req.params.keybrandname) {
        query = { keybrandname: req.params.keybrandname };
      }
      let products = await db.collection("products").find(query).toArray();
      res.json({
        statusCode: 200,
        products,
        message: "Product By BrandName Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// name
router.get("/getProductKeyName/:keyname", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("myproducts");
    let user = await db.collection("products");
    if (user) {
      let query = {};
      if (req.params.keyname) {
        query = { keyname: req.params.keyname };
      }
      let products = await db.collection("products").find(query).toArray();
      res.json({
        statusCode: 200,
        products,
        message: "Product By BrandName Data Get Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
