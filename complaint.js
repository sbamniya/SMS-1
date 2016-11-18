exports.addComplaint = function(pool){
  return function(req,res){
    var resident_id =  req.body.resident_id;
    var subject = req.body.subject;
    var complaint= req.body.complaint;
    var suggestion= req.body.suggestion;  

    var queryString="INSERT INTO complaint_master(resident_id, subject,complaint,suggestion,date,status) VALUES("+resident_id+" ,'"+subject+"', '"+complaint+"','"+suggestion+"',now(), 0)";
    var result = {};
    pool.query(queryString, function(err, rows, fields)  {
        if (err)
        {
          result.error= err;
        }
        else{
          result.success = "complaint inserted successfully";
          result.last_id = rows.insertId;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result)); 
     });  
  };
};

exports.getcomplaintDetail= function(pool){
  return function(req,res){  
    res.setHeader('Content-Type', 'application/json');

    var id = req.body.complaintID;
    var result = {};
    var query = "SELECT cm.*, smas.name as society_name, concat(r.first_name, ' ', r.last_name) as resident_name, r.email, r.contact_no, bm.name as block_name, fm.flat_number, sman.manager_name FROM `complaint_master` cm INNER JOIN residents r on r.id=cm.resident_id INNER JOIN flat_master fm on fm.id=r.flat_id INNER JOIN block_master bm on bm.id=fm.block_id INNER JOIN society_master smas on smas.id=bm.parent_id INNER JOIN society_manager sman on sman.id = bm.block_manager where cm.id='"+id+"'";
   
    pool.query(query, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else{
        result.success = JSON.stringify(rows[0]);
        res.send(JSON.stringify(result));
        return;
      }
    });
  }
};
exports.getcomplaintList= function(pool){
  return function(req,res){  
    var id=req.query.id;    
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

    var query = "SELECT *, CASE status WHEN '0' THEN 'Pending' WHEN '1' THEN 'Under Surveillance' WHEN '2' THEN 'Resolved' ELSE NULL END AS status, DATE_FORMAT(date, '%d %M, %Y') as date FROM complaint_master where resident_id='"+id+"'";
    if(search_key!=''){
    query +=' AND (resident_id like "%'+search_key+'%" or subject like  "%'+search_key+'%" or complaint like  "%'+search_key+'%" or suggestion like  "%'+search_key+'%" )';
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