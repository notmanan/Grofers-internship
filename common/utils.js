function badRequestHandler(req, res, message){
  res.status(400)
  res.json({message: message})
}

function errorHandler (err, req, res, message) {
  res.status(500)
  console.log("Error.")
  res.json({ error: err, message:message })
}

/**
* Returns the time difference in weeks between two Dates.
@oaram {Date} dt2 ()
@oaram {Date} dt2 ()
@return {float} (Difference in weeks)
*/
function diff_weeks(dt2, dt1){
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7);
  return Math.abs((diff));
}

const utils = {badRequestHandler: badRequestHandler, errorHandler:errorHandler, diff_weeks:diff_weeks}
module.exports = utils
