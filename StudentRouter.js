const router=require("express").Router();
const Student=require("../models/Student")

router.post("/addstudent",function(req,res){	
	//INSERT
	console.log("----data----")	
	console.log(req.body)
	var student1 = new Student({
            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mobile,
			city: req.body.city
        }); 
	student1.save(function (err, student) {
	      if (err) return console.error(err);
	      id=student._id;
	      console.log(student._id + " saved to students collection.");	      
	      //res.status(200).send(book);
	      //res.send(book._id + " saved to books collection.")
		  res.json({msg:'success'});
    }); 
})

router.get('/home',function(req,res){
	res.render('try');
   });

router.get("/",(req,res)=>{
//Get all
	Student.find(function (err, students) {
  		if (err) return console.error(err);
  		console.log(students);
	//	res.render("list",{booksList:books})
  		res.json({data:students});
	
	})
});
router.get("/:id",(req,res)=>{
	//Get one req.params.id
	Student.findById({"_id":req.params.id}, function (err, student) 
	{
        if (err) return res.status(500).send(
        	"There was a problem finding.");
        if (!student) return res.status(404).send(
        	"No data found.");
        res.status(200).send(student);
    });
});

router.put("/:id",(req,res)=>{
//UPDATE  req.params.id, req.body
    Student.findOneAndUpdate({"_id":req.params.id}, req.body,  //The default is to return the original, unaltered document. If you want the new, updated document to be returned you have to pass an additional argument: an object with the new property set to true.
    	{new: true}, function (err, student) {
        if (err) return res.status(500).send(
        	"There was a problem updating.");
        res.status(200).send(student);
    });
});

router.delete("/removeStudent",(req,res)=>{
//DELETE req.params.id deleteOne() deleteMany() findOneAndRemove()
	Student.findOneAndRemove({"_id":req.body.id},
	 function (err, student) {
		if(err){
			res.json({msg:'error'});
		}else{
			res.json({msg:'success'});
		}
    });
});
module.exports=router;