import Job from "../models/job.model.js";

// ************************* Controller to post a job *************************************
// For Recruiter , to post a job
const postJob = async (req , res)=>{
    try{
        const {title , description , requirements , location , salary , jobType , experience , position , companyId} = req.body;
        const userId = req.id;
        // Check whether all required fields are filled or not
        if(!title || !description || !requirements || !location || !salary || !jobType || !experience || !position || !companyId){
            return res.json({success:false , message:"Please fill all required fields"});
        }
        // Post the job
        const job = new Job({
            title , 
            description,
            requirements : requirements.split(","),
            salary : Number(salary),
            location,
            jobType,
            experience : Number(experience),
            position : Number(position),
            company : companyId,
            createdBy : userId
        });
        await job.save();

        return res.status(200).json({success:true , message:"Job created successfully" , job});
    }catch(error){
        console.log("Error in post job controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to list all available jobs *************************************
// For student , to view jobs on the app
const getAllJobs = async (req , res)=>{
    try{
        // To view jobs and filter jobs based on the search query
        const keyword = req.query.keyword || "";
        const query = {
            $or : [
                {title : {$regex:keyword , $options:"i"}},
                {description : {$regex:keyword , $options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate("company").sort({createdAt:-1});
        if(!jobs){
            return res.json({success:false , message:"Jobs not found"});
        }
        return res.status(200).json({success:true , message:"Jobs Found" , jobs});
    }catch(error){
        console.log("Error in view all jobs controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to get job by id *************************************
// For students , to view a particular job 
const getJobById = async (req , res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company");
        if(!job){
            return res.json({success:false , message:"Job Not Found"});
        }
        return res.status(200).json({success:true , message:"Job Found" , job});
    }catch(error){
        console.log("Error in get job by id controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to get jobs created by a recruiter *************************************
// For Recruiter , to view the jobs created by himself
const getRecruiterJobs = async (req , res)=>{
    try{
        const recruiterId = req.id;
        const jobs = await Job.find({createdBy : recruiterId}).populate("company");
        if(!jobs){
            return res.json({success:false , message:"Jobs not found"});
        }
        return res.status(200).json({success:true , message:"Jobs Found" , jobs});
    }catch(error){
        console.log("Error in get recruiter jobs controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}



export {postJob , getAllJobs , getJobById , getRecruiterJobs};