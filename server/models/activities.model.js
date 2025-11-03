import mongoose from 'mongoose'

const activitySchema =new mongoose.Schema({
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },
    action:{
        type:String
    },
    description:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now()
    }
},{
    timestamps:true
});

const Activity= mongoose.model("Activities",activitySchema)

export default Activity;