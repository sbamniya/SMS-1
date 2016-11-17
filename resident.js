exports.addResident=function(pool,randomstring,crypto, transporter){
  return function(req,res){
    res.setHeader('Content-Type', 'application/json');
    var email = req.body.email;
    var id = req.body.id;
    
    var result = {};  
    var queryString = 'select * from residents where email ="'+email+'"';
    pool.query(queryString, function(err, rows, fields){
      if (err)
      {
      
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
        else { 
          
          var query = "SELECT LCASE(concat(sm.slug, '-', bm.slug, '-', fm.flat_number)) as user_name FROM society_master as sm INNER JOIN block_master as bm on sm.id=bm.parent_id INNER JOIN flat_master as fm on bm.id=fm.block_id WHERE fm.id=" +id;
                                                                                               
          pool.query(query, function(err, rows, fields){
            if (err){
              console.log(err);
              result.error= err;
              res.send(JSON.stringify(result));   
              return;
            } 
           else{
                 
                var user_name= rows[0].user_name;
                var text = "";
                var randS = randomstring.generate();    
                for( var i=0; i < 10; i++ ){
                  text += randS.charAt(Math.floor(Math.random() * randS.length)); 
                }
                
                transporter.sendMail(
                {
                  from: 'kalika.deltabee@gmail.com',
                  to: email,
                  subject: 'Welcome to Man2Help',
                  html: 'Hello Resident !<br/>Your username is: '+user_name+'<br/>Your password is: '+text+' '

                  }, function(error, response) {
                  if (error) 
                  {
                    console.log(error);
                  } 
                  else 
                  {
               
                      
                  var query = "INSERT INTO residents (`flat_id`,`user_name`,`password`,`email`, `resident_no`,`status`) VALUES("+id+",'"+user_name+"','"+text+"','"+email+"','1', '1') ON DUPLICATE KEY UPDATE email='"+email+"', password='"+text+"', resident_no=resident_no+1";
                  pool.query(query, function(err, rows, fields){
                        if (err){
                          console.log(err);
                          result.error= err;
                          res.send(JSON.stringify(result));   
                      }
                      
                  else{
                        var queryString = "update flat_master set is_updated=1 where id='"+id+"'"; 
                        pool.query(queryString, function(err, rows, fields){});

                        result.success="Resident Registered Successfully";
                        res.send(JSON.stringify(result));   
                        return;    
                      }

                 });
            
               };
        
             });
      
           };
         });
       };
     };
    });
   };
};


    exports.login = function(crypto,pool){
        return function(req,res){
        {

            sess=req.session;

            var user_name= req.body.userName;
            var password = req.body.password;
            var queryString = 'SELECT * FROM residents where user_name = "'+user_name+'"';
            var result = {};

            pool.query(queryString, function(err, rows, fields) {

                if (err)
                {
                    result.error= err;
                }
                else
                {

                    if(rows.length==0)
                    {
                        result.error= "Resident not Exist.";
                    }
                    else
                    {
                        if (rows[0].status==1) 
                        {   //Creating hash with received password value for comparison : DR
                            var passwordn = password;

                            if (passwordn != rows[0].password) 
                            {
                                
                                result.error = "Password didn't match.";
                            }
                            else
                            {
                                sess.userID = rows[0].id;
                                sess.userPrivilege = 1;
                                sess.userLevel = "Resident";
                                result.success = rows[0];
                            }
                        }
                        else
                        {
                            result.error = "User Not Varified.";
                        }

                    }

                 }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result)); 

            });


        };
      };
    };
exports.resetPasswordProcess = function(transporter,randomstring,pool){
             return function(req,res){

                var email = req.body.email;
                var result = {}; 
                var host = req.protocol+'://'+req.headers.host+'/'; 
                 var queryString = 'select * from residents where email ="'+email+'"';
                 res.setHeader('Content-Type', 'application/json');
                  pool.query(queryString, function(err, rows, fields)  {
                     if (err){
                         result.error= err;
                         
                       } 
                      else{  
                            if(rows.length==0){
                                result.error="Email Not Exist";
                                res.send(JSON.stringify(result));   
                              }
                          
                            else{
                                    var randS = randomstring.generate();
                                    transporter.sendMail({
                                    from: 'kalika.deltabee@gmail.com',
                                    to: email,
                                    subject: 'Reset Password',
                                    html: 'Hey '+rows[0].first_name+' '+rows[0].last_name+'!<br/> Your Login Details For Man2Help Resident Login are: <br>Username: <b>'+rows[0].user_name+'</b> <br> Passsword: <b>'+rows[0].password+'</b>'
                                }, function(error, response) {
                                   if (error) {
                                        console.log(error);
                                   } else {
                                        console.log('Message sent');
                                     }
                                  }); 
                               }
                          /*queryString1 = 'UPDATE residents SET forget_token= "'+randS+'" where id = '+rows[0].id;
                          pool.query(queryString1, function(err, rows, fields)  {

                          });*/
                          result.success="Your Password Has been sent to your Email";
                          
                          res.send(JSON.stringify(result));   

                        };

                    });
                };
            };
exports.confirmToken= function (pool){
     return function(req,res){
      var token = req.body.token;
      var id = req.body.userid;
      var result = {};
     
      var queryString = 'select * from residents where  forget_token ="'+token+'" and id = "'+id+'"';
      pool.query(queryString, function(err, rows, fields)  {
             if (err){
                
                 result.error= err;
                 res.setHeader('Content-Type', 'application/json');
                 res.send(JSON.stringify(result));   
             }
             else
             {
              if(rows.length==0)
                {
                    result.error= "You are not authorize to change password for the user";
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));   
                }
              else
                {
                    result.succes = "go";
                    result.id = id;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));       
                }
                   
             }
      });
  };
};


exports.updatePassword=  function(crypto,pool){
    return function(req,res){
 
    var id = req.body.id;
    var newpass = req.body.pass;
    var passwordn = crypto.createHash('md5').update(newpass).digest("hex");
    var result = {};
    
           
             var queryString = 'UPDATE residents SET  password ="'+passwordn+'",forget_token=""  where id = "'+id+'"';
            
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
       /* exports.resetPasswordProcess = function(transporter,randomstring,pool){
             return function(req,res){

                var email = req.body.email;
                var result = {}; 
                var host = req.protocol+'://'+req.headers.host+'/'; 
                 var queryString = 'select * from residents where email ="'+email+'"';
                  pool.query(queryString, function(err, rows, fields)  {
                     if (err){
                         result.error= err;
                         
                       } 
                      else{  
                            if(rows.length==0){
                                result.error="Email Not Exist";
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(result));   
                              }
                          
                            else{
                                    transporter.sendMail({
                                    from: 'kalika.deltabee@gmail.com',
                                    to: email,
                                    subject: 'Reset Password',
                                    html: 'Hey 'name'!<br/> Please click <a href="'+host+'#/manager-new-password/'+randS+'/'+id+'">here</a> to Reset Password!'
                                }, function(error, response) {
                                   if (error) {
                                        console.log(error);
                                   } else {
                                        console.log('Message sent');
                                     }
                                  }); 
                               }
                         
                          result.success="Please check mail to reset password";
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify(result));   

                        };

                    });
                };
            };
   
    */

        exports.getresidentList= function(pool){
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
          var query = "select * from  `residents`";
          if(search_key!=''){
            query +=' WHERE first_name like "%'+search_key+'%" or last_name like  "%'+search_key+'%" or email like  "%'+search_key+'%"';
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


     exports.getresidentInfo= function(pool){
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
              var query = "select rs.first_name,rs.last_name,rs.user_name,rs.ownership,rs.email,rs.contact_no,fm.flat_number,fm.storey_number,fm.type_of_flat,fm.area,fm.location ,bm.name as block_name,bm.block_manager,sm.name as society_name,sm.society_manager from flat_master as fm inner join residents as rs on rs.flat_id=fm.id inner join block_master as bm on fm.block_id=bm.id inner join society_master as sm on bm.parent_id=sm.id";
              if(search_key!=''){
                query +=' WHERE first_name like "%'+search_key+'%" or last_name like  "%'+search_key+'%" or email like  "%'+search_key+'%"';
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

       exports.tenantList= function(pool){
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
              var query = "select * from  `residents` where ownership='tenant'";
                 if(search_key!=''){
                    query +=' WHERE first_name like "%'+search_key+'%" or last_name like  "%'+search_key+'%" or email like  "%'+search_key+'%"';
                  }

                  query += " order by id desc";
                  pool.query(query, function(err, rows, fields){
                      
                    if(err){
                        console.log(err);
                   }
                    else{
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


        exports.ownerList= function(pool){
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
              var query = "select * from  `residents` where ownership='owner'";
                 if(search_key!=''){
                    query +=' WHERE first_name like "%'+search_key+'%" or last_name like  "%'+search_key+'%" or email like  "%'+search_key+'%"';
                  }

                  query += " order by id desc";
                  pool.query(query, function(err, rows, fields){
                      
                    if(err){
                        console.log(err);
                  }
                  else{
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
        
exports.getFlatResident= function(pool){
  return function(req,res){ 
    res.setHeader('Content-Type', 'application/json');
    var flat_id = req.body.id;
    var result = {};
    console.log(req.body);
    if (flat_id=='') {
      result.error = 'Please Pass Flat Id to Get Details';
      res.send(JSON.stringify(result));
      return;
    }

    var query = 'select * from residents where flat_id = "'+flat_id+'"';
    pool.query(query, function(err, rows, fields){
      if (err) {
        result.error = err;
        res.send(JSON.stringify(result));
        return;
      }
      console.log(rows);
      if (rows.length==0) {
        result.error = "Details Not Found.";
        res.send(JSON.stringify(result));
        return;
      }
      result.success = rows[0];
      res.send(JSON.stringify(result));
      return;
    });


  }
}; 