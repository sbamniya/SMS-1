exports.getmanagerList= function(pool){
   return function(req,res){  
       
      var draw = req.query.draw;
      var start = req.query.start;
      var length = req.query.length;
      var search_key = req.query.search.value;
      var end = parseInt(start) + parseInt(length);
      
      var pageSize = length != null ? parseInt(length) : 0;
      var skip = start != null ? parseInt(start) : 0;
      var recordsTotal = 0;

      res.setHeader('Content-Type', 'application/json');
      var result = {};
      var query = "select * from  `society_manager`";
      if(search_key!=''){
        query +=' WHERE manager_name like "%'+search_key+'%" or email like "%'+search_key+'%"';
      }

      query += " order by id desc";
        pool.query(query, function(err, rows, fields){
            if(err){
                console.log(err);
            }else{
                result.draw = draw;
                recordsTotal = rows.length;
                result.recordsTotal = recordsTotal;

                var resultData = []
                resultData.push(rows.slice(skip, parseInt(skip)+parseInt(pageSize)));

                result.recordsFiltered = recordsTotal;
                result.success = JSON.stringify(resultData[0]);
                res.send(JSON.stringify(result));
                return;
            }
        });
      }
};
exports.ActiveManagersList= function(pool){
   return function(req,res){  
       
      
      res.setHeader('Content-Type', 'application/json');
      var result = {};
      var query = "select * from  `society_manager` where status=1 order by id desc";
     
      pool.query(query, function(err, rows, fields){
          if(err){
              console.log(err);
          }else{
              result.success = JSON.stringify(rows);
              res.send(JSON.stringify(result));
              return;
          }
      });
    }
};


exports.addManager=function(pool,randomstring,crypto, transporter){
  return function(req,res){
    res.setHeader('Content-Type', 'application/json');
    var email = req.body.email;
    var result = {};  
    var queryString = 'select * from society_manager where email ="'+email+'"';
    pool.query(queryString, function(err, rows, fields){
      if (err)
      {
        console.log(err);
        result.error= err;
        res.send(JSON.stringify(result));   
        return;
      } 
      else
      {
        if(rows.length>0)
        {
          result.error="Email Already Exist";
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));  
          return;
        }
        else
        { 
          $data = req.body;
          var idType =  $data.idType;
          var idNumber = $data.idNumber;
          var manager_name= $data.manager_name;
          var email =$data.email;
          var text = "";
          var randS = randomstring.generate();    
          for( var i=0; i < 5; i++ ){
            text += randS.charAt(Math.floor(Math.random() * randS.length));
          }
          var password = crypto.createHash('md5').update(text).digest("hex");
          var query = "INSERT INTO society_manager (`idType`,`idNumber`, `manager_name`,  `email`,`password`, `status`) VALUES ('"+idType+"','"+idNumber+"','"+manager_name+"','"+email+"','"+password+"','1')";
          pool.query(query, function(err, rows, fields){
            if (err){
              console.log(err);
              result.error= err;
              res.send(JSON.stringify(result));   
              return;
            } 
            else
            { 
              transporter.sendMail(
                {
                  from: 'kalika.deltabee@gmail.com',
                  to: email,
                  subject: 'Check  Id & Password',
                  html: 'Hey '+manager_name+'<br/>Your id is: '+email+'<br/>Your password is: '+text+' '

                  }, function(error, response) {
                  if (error) 
                  {
                    console.log(error);
                  } 
                  else 
                  {
                    console.log('Message sent');
                  }

              });
              result.success="Manager Registered Successfully";
              res.send(JSON.stringify(result));   
              return;
            };
          });
          
          
        };
      };
    });
  };
};
exports.societyBlockList= function(pool){
 return function(req,res){  
        sess=req.session;
        var id =  sess.userID;
        res.setHeader('Content-Type', 'application/json');
        var result = {};
        var query = "SELECT sm.name as society_name, bm.name as block_name, bm.id FROM block_master as bm INNER JOIN society_master as sm on sm.id=bm.parent_id where bm.block_manager='"+id+"' and bm.status= 1 "; 
        pool.query(query, function(err, rows, fields){
           if(err)
           {
              console.log(err);
           }
           else
           {
              result.success = rows;
              res.send(JSON.stringify(result));
              return;
            }
        });

     };

  };
   exports.checkForSocietyManager= function(pool){
           return function(req,res){  

                  
                    sess=req.session;
                    var id =sess.userID;
                    res.setHeader('Content-Type', 'application/json');
                    var result = {};
                    var query = "select * from  `society_master` where society_manager = '"+id+"' and status =1 "; 

              pool.query(query, function(err, rows, fields){
                  if(err)
                 {
                    console.log('error');
                  }
                  
                  else
                  {
                       if(rows.length>0)
                       {
                           result.is_societymanager=1;
                       }
                    
                       res.send(JSON.stringify(result));
                       return;
                  }
              
              });
           
           };

        };
exports.deleteManager = function(pool){
  return function(req,res){
    var id =  req.body.id;
    var result = {}
    pool.query("DELETE FROM society_manager WHERE id=?",[id],function(err, rows, fields){
          if(err)
          {
              result.error = err;
          }
        else
          {
            result.success = "Manager deleted successfully";
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result)); 
          };  
      });

  };
};
exports.updatePassword=  function(crypto,pool){
        return function(req,res)
        {
            sess=req.session;
            var id =sess.userID;
            var newpass = req.body.pass;
            var passwordn = crypto.createHash('md5').update(newpass).digest("hex");
            var result = {};
            var queryString = 'UPDATE society_manager SET  password ="'+passwordn+'",forget_token=""  where id = "'+id+'"';
            
            pool.query(queryString, function(err, rows, fields)  {
                     if (err){
                         result.error= err;
                         res.setHeader('Content-Type', 'application/json');
                         res.send(JSON.stringify(result));   
                     }
                     else
                     {  
                            result.succes = "Your Password has been changed successfully.";
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result));       
                     }
              });
        

  };
};