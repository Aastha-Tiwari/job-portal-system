import { Router } from "express";
import { getCompanies, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const companyRouter = Router();

companyRouter.post('/register' , isAuthenticated , registerCompany);
companyRouter.get('/get' , isAuthenticated , getCompanies);
companyRouter.get('/get/:id' , isAuthenticated , getCompanyById);
companyRouter.put('/update/:id' , isAuthenticated , updateCompany);


export default companyRouter;