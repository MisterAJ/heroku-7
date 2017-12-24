var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
    type: String,
    required: false,
    trim: true
  },
   admin: {
       type: Boolean,
       default: false
   }
});


// authenticate input against database documents
// UserSchema.statics.authenticate = function(email, password, callback) {
//   User.findOne({ email: email })
//       .exec(function (error,user) {
//         if (error) {
//           return callback(error);
//         } else if ( !user ) {
//           var err= new Error('User not found.');
//           err.status = 401;
//           return callback(err);
//         }    
//         bcrypt.compare(password, user.password , function(error, result) {
//           if (result === true) {
//               return callback(null, user);
//           } else {
//               return callback();
//           }   
//         });
//       });
// };

// hash password before saving to database
// UserSchema.pre('save', function(next){
//   var user = this;
//   bcrypt.hash(user.password, 10, function(err, hash) {
//     if (err){
//         return next(err);
//     } 
//     user.password = hash;
//     next();
//   });
// });

var User = mongoose.model('User', UserSchema);
module.exports = User;