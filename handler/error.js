
function getErrorMessage(err){
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            var ms=err.errmsg.substring(50);
            var msg=ms.split(" ");
            if(msg[0]=="users"){
                message = "This user already registered with user";
                break;
            }             
            else{
                message = 'Duplicate Value Detected.';
                break;
            }
            case 139:
                message = err.errmsg;
                break;
                     case 11001:
                message = 'Already Exists.';
                break;
            default:
                message = 'Something went wrong.';
                break;
        }
        return message;
    } 
    else if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                return err.errors[errName].message;
        };
    }
    else {
        return err.message;
    }
}



module.exports.sendMongooseErrorMessage = function (err, res){
    var errMessage = getErrorMessage(err);
    // var berr = boom.create(500, err.name, errMessage);
    // berr.output.payload.data = berr.data;
  return res.status('500').json(errMessage);
   
}
