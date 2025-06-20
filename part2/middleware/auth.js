function check_owners(req,res,next){
    if(req.session.user && req.session.user.role === 'owner'){
        next();
    }
    else{
        res.status(403).redirect('/');
    }
}
function check_walkers(req,res,next){
    if(req.session.user && req.session.user.role === 'walker'){
        next();
    }
    else{
        res.status(403).redirect('/');
    }
}