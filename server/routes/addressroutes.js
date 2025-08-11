import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress
} from "../controllers/address.controller.js";

const AddressRouter = Router();

// Routes
AddressRouter.post('/', auth, addAddress);        
AddressRouter.get('/', auth, getAddress);         
AddressRouter.put('/:id', auth, updateAddress);    
AddressRouter.delete('/:id', auth, deleteAddress); 

export default AddressRouter;
