import { Router } from "express";
import { applyJob, deleteApplication, getAllAppliedJobs, getApplicants, updateStatus } from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const applicationRouter = Router();

applicationRouter.get('/apply/:id' , isAuthenticated , applyJob);
applicationRouter.get('/get-applied-jobs' , isAuthenticated , getAllAppliedJobs);
applicationRouter.get('/get-applicants/:id' , isAuthenticated , getApplicants);
applicationRouter.put('/update-status/:id' , isAuthenticated , updateStatus);
applicationRouter.delete('/delete/:id' , isAuthenticated , deleteApplication);

export default applicationRouter;