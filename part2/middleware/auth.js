function check_owners(req,res,next){
    if(req.session.user && req.session.user.role === 'owner'){
        next();
    }
}