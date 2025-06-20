
function check_owners(req,res,next){
    if(req.session.user && req.session.user.role === 'owner'){
        next();
    }
    else{
        res.redirect('/');
    }
}
function check_walkers(req,res,next){
    if(req.session.user && req.session.user.role === 'walker'){
        next();
    }
    else{
        res.redirect('/');
    }
}
module.exports = { check_owners, check_walkers };
