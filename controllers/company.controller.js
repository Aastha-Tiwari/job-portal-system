import Company from "../models/company.model.js";


// ************************* Controller to register company *************************************
const registerCompany = async (req , res)=>{
    try{
        const {companyName} = req.body;
        // check whether all the required fields are filled.
        if(!companyName){
            return res.json({success:false , message:"Company Name is required"});
        }
        let company = await Company.findOne({name : companyName});
        if(company){
            return res.json({success:false , message:"You can't register same company. This company already exists."});
        }
        company = new Company({
            name : companyName,
            userId : req.id
        });
        await company.save();

        return res.status(200).json({success:true , message:"Company registered successfully" , company});
    }catch(error){
        console.log("Error in register company controller");
        return res.status(500).json({success:false , message:"Internal Server Error"}); 
    }
}


// ********************** Controller to get companies of a particular user ****************************
const getCompanies = async (req , res)=>{
    try{
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies){
            return res.json({success:false , message:"Companies not found"});
        }
        return res.status(200).json({success:true , message:"Companies Found" , companies});
    }catch(error){
        console.log("Error in get companies controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to get company by id *************************************
const getCompanyById = async (req , res)=>{
    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.json({success:false , message:"Company not found"});
        }
        return res.status(200).json({success:true , message:"Company Found" , company});
    }catch(error){
        console.log("Error in get company controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to update company *************************************
const updateCompany = async ( req , res)=>{
    try{
        const updateData = req.body; // send name or description or location or website link

        const company = await Company.findByIdAndUpdate(req.params.id , updateData , {new:true});

        if(!company){
            return res.json({success:false , message:"Company Not Found"});
        }

        return res.status(200).json({success:true , message:"Company Updated Successfully" , company});
    }catch(error){
        console.log("Error in update company controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}

export {registerCompany , getCompanies , getCompanyById , updateCompany};