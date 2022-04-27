module.exports = {
    alert : async function(req, res, type, message, redirect){
        req.session.lastAlert = {
            type: type,
            message: message
        }
        res.redirect(redirect)
    }
}