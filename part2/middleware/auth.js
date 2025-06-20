//to make the login become more legit here is the middleware implementation
function check_owners(req,res,next){
    //check the user is logged in and his role is owner
    if(req.session.user && req.session.user.role === 'owner'){
        next();
    }
    else{
    //if mismatch or not logged in, go back to login page
        res.redirect('/');
    }
}
function check_walkers(req,res,next){
    //check the user is logged in and his role is walker
    if(req.session.user && req.session.user.role === 'walker'){
        next();
    }
    else{
        res.redirect('/');
    }
}
module.exports = { check_owners, check_walkers };
