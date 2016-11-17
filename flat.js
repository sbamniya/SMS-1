    exports.addFlat = function(pool){
        return function(req,res){
        var block_id =  req.body.block_id;
        var storey_no = req.body.storey_number;
        var flat_no= req.body.flat_no;
        var type= req.body.type_of_flat;    


            var queryString="INSERT INTO flat_master(block_id, storey_number,flat_number,type_of_flat,status) VALUES("+block_id+" ,"+storey_no+", '"+flat_no+"',"+type+", 1)";


             var result = {};

            pool.query(queryString, function(err, rows, fields)  {

              if (err)
              {
                  result.error= err;
              }
              else{
                 result.success = "Flat inserted successfully";
              }

              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(result)); 



         });  

    };
    };


    exports.getFlatList = function(pool){

       return function(req,res){  

        var id = req.body.id;
        var storey_number = req.body.storey_number;

        res.setHeader('Content-Type', 'application/json');
        var result = {};
        var query = "select * from `flat_master` where block_id='"+id+"' and storey_number ='"+storey_number+"'";
          pool.query(query, function(err, rows, fields){
              if(err){
                  console.log('error');
              }else{
                    var query ="update block_master set is_updated = 1 where id = "+id;
                    pool.query(query, function(err, rows, fields)  {

                            result.success="Flat added successfully";
                        });
                   result.success = rows;
                   res.send(JSON.stringify(result));
                   return;
              }
          });

      }

    };