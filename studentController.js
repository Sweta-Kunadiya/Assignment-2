const express = require('express');

const mongoose = require('mongoose');

const Student = mongoose.model('Student');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("student/addOrEdit",{
        viewTitle:"Insert student"
    })
})

router.post("/",(req,res) => {
    if(req.body._id == "")
    {
    insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
})

function insertRecord(req,res)
{
   var student = new Student();

   student.fullName = req.body.fullName;

   student.email = req.body.email;

   student.city = req.body.city;

   student.mobile = req.body.mobile;

   student.save((err,doc) => {
       if(!err){
        res.redirect('student/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("student/addOrEdit",{
                  viewTitle:"Insert student",
                  student:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    Student.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('student/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("student/addOrEdit",{
                    viewTitle:'Update student',
                    student:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Student.find((err,docs) => {
        if(!err) {
            res.render("student/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Student.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("student/addOrEdit",{
                viewTitle: "Update student",
                student: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Student.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/student/list');
        }
        else{
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'fullName':
              body['fullNameError'] = err.errors[field].message;
              break;
        
        case 'email':
              body['emailError'] = err.errors[field].message;
              break;

        default:
           break;
        }
    }
}

module.exports = router;