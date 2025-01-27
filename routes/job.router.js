import { Router } from "express";
import { getAllJobs, getJobById, getRecruiterJobs, postJob } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const jobRouter = Router();

jobRouter.post('/post' , isAuthenticated , postJob);
jobRouter.get('/get', isAuthenticated , getAllJobs);
jobRouter.get('/get-recruiter-jobs' , isAuthenticated , getRecruiterJobs);
jobRouter.get('/get/:id' , isAuthenticated , getJobById);

export default jobRouter;