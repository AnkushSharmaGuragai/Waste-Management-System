const mongoose = require('mongoose');
const User = require('../Model/User'); 


const handleModifyUser = async (req, res) => {
  try {
   
    const {userId, name, email, dueAmount } = req.body; 

    // Check if the logged-in user is admin or modifying their own information
   //  if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
   //    return res.status(403).send('Unauthorized access');
   //  }

    // Find the user by userId
    const user = await User.findById(userId);
    console.log(user);
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update the user fields if provided in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (dueAmount !== undefined) user.dueAmount = dueAmount;  // Only modify dueAmount if it is provided

    // Save the updated user document
    await user.save();

    // Send success response
    res.status(200).send('User updated successfully');
  } catch (error) {
   //  console.error(error);
    res.status(500).send('Server error');
  }
};

// Sample validateAdminLogin function (could be used for role-based access control)
const validateAdminLogin = async (req, res) => {
  try {
    console.log(req.user); // Assuming req.user is populated by a middleware like JWT authentication
    if (req.user.role === "admin") {
      res.send("Admin Login");
    } else {
      res.status(403).send("Unauthorized access");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = { validateAdminLogin, handleModifyUser };
