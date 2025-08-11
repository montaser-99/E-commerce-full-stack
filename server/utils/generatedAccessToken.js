

import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
  if (!process.env.ACCESSTOKEN_SECRET) {
    throw new Error("Missing ACCESSTOKEN_SECRET in environment variables.");
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: '1h',
  });

  return token;
};

 
export default generateAccessToken;
