const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { generateToken } = require("../utils/jwt");

const registerUser = async (name, email, password) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const loginUser = async (email,password) => {
    const user = await prisma.user.findUnique({
      where:{
        email,
      },
    });

    if(!user){
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password,user.password);

    if(!passwordMatch){
      throw new Error("Invlid username or password");
    }

    const token = generateToken(user.id);

    return{
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
};

module.exports = {
  registerUser,
  loginUser,
};