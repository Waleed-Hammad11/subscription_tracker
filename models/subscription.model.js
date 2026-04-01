import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    name:{
        type:String,
        required :[true,'Subscription name is required'],
        trim:true,
        minlength:2,
        maxlength:50,
    },
    price:{ 
        type:Number,
        required:[true,'Subscription price is required'],
        min:0,
    },
    currency:{
        type:String,
        required:[true,'Subscription currency is required'],
        enum:['USD','EUR','GBP'],
        default:'USD'
    },
    frequency:{
        type:String,
        required:[true,'Subscription frequency is required'],
        enum:['daily','weekly','monthly','yearly']
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Subscription category is required'],
        enum:['sports','entertainment','news','lifestyle','technology','finance','politics','other']
    },
    paymentMethod:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Subscription payment method is required'],
        trim:true
    },
    status:{
        type:String,
        required:[true,'Subscription status is required'],
        enum:['active','cancelled','expired'],
        default:'active'
    },
    startDate:{
        type:Date,
        required:[true,'Subscription start date is required'],
        validator : (value) => value <= new Date(),
        message: 'Start date must be in the past'
    },
    renewalDate:{
        type:Date,
        required:[true,'Subscription start date is required'],
        validator : function(value) {
            return value > this.startDate
            } ,
        message: 'Renewal date must be after start date'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Subscription user is required'],
        trim:true,
        index:true,
        ref:'User'
    }
},{timestamps:true})

subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        }

        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency])
    }

    if (this.renewalDate < new Date()){
        this.status = 'expired'
    }

    next()
})

const Subscription = mongoose.model('Subscription',subscriptionSchema)

export default Subscription