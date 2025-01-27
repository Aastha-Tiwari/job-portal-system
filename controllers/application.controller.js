import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

// ************************* Controller to apply for a job *************************************
// For students 
const applyJob = async (req , res)=> {
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.json({success:false , message:"Job Id is required"});
        }
        // to check whether the user already applied for this job or not
        const existingApplication = await Application.findOne({job:jobId , applicant:userId});
        if(existingApplication){
            return res.json({success:false , message:"You have already applied for this job"});
        }
        // check if the job exists or not
        const job = await Job.findById(jobId);
        if(!job){
            return res.json({success:false , message:"Job does not exist"});
        }
        // Job exist and user is new to apply for this job
        const newApplication = new Application({
            job:jobId,
            applicant:userId
        });

        await newApplication.save();

        // Now add application id to the job 's applications array which holds application id of all the applications from different users
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(200).json({success:true , message:"Job applied successfully"});
    }catch(error){
        console.log("Error in apply job controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// **************** Controller to delete an application for the previously applied job *****************
const deleteApplication = async (req , res)=>{
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.json({ success: false, message: "Job ID is required" });
        }
        // Find the application to ensure it exists and belongs to the current user and delete it
        const existingApplication = await Application.findOneAndDelete({
            job: jobId,
            applicant: userId,
        });

        if (!existingApplication) {
            return res.json({ success: false, message: "Application not found or already deleted" });
        }
      
        // Remove the application ID from the job's `applications` array
        await Job.findByIdAndUpdate(jobId, {
            $pull: { applications: existingApplication._id },
        });
    
        return res.status(200).json({ success: true, message: "Application deleted successfully" });
    }catch(error){
        console.log("Error in update status controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************** Controller to get all the applied jobs of a particular user **********************
// For students , to see all the jobs applied by himself
const getAllAppliedJobs = async (req , res)=>{
    try{
        const userId = req.id;
        const applications = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        });

        if(!applications){
            return res.json({success:false,message:"No applications"});
        }

        return res.status(200).json({success:true , message:"Applications Found" , applications}); 

    }catch(error){
        console.log("Error in get all applied jobs controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************** Controller to get all the applicants of a particular job **********************
// For recruiter , to see the applicants of job posted by himself
const getApplicants = async (req , res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant"
            }
        });
        if(!job){
            return res.json({success:false , message:"Job not found"});
        }
        return res.status(200).json({success:true,message:"Applicants found for the job" , job});
    }catch(error){
        console.log("Error in get all applicants controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************** Controller to update status of the application **********************
const updateStatus = async (req , res)=>{
    try{
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.json({success:false , message:"Status is required"});
        }
        await Application.findByIdAndUpdate(applicationId , {status : status.toLowerCase()} , {new:true});
        return res.status(200).json({success:true,message:"Application status updated successfully"});
    }catch(error){
        console.log("Error in update status controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


export {applyJob , getAllAppliedJobs , getApplicants , updateStatus , deleteApplication};