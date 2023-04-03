const authService = require('../services/authService');

async function loginByIdNumber(req, res) {
  try {
    const { idnumber, password } = req.body;
    const response = await authService.loginByIdNumber(idnumber, password);
    if(response.status == 0) res.status(200).json({ token: response.token, message: response.message });
    else if(response.status == 1) res.status(404).json({ message: response.message });
    else res.status(401).json({ message: response.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function loginByEmail(req, res) {
  try {
    const { email, password } = req.body;
    const response = await authService.loginByEmail(email, password);
    if(response.status == 0) res.status(200).json({ token: response.token, message: response.message });
    else if(response.status == 1) res.status(404).json({ message: response.message });
    else res.status(401).json({ message: response.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function loginByEmailAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const response = await authService.loginByEmailAdmin(email, password);
    if(response.status == 0) res.status(200).json({ token: response.token, message: response.message });
    else if(response.status == 1) res.status(404).json({ message: response.message });
    else res.status(401).json({ message: response.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function createUser(req, res) {
  try {
    // console.log(req.user);
    // res.status(409).json({ message: 'พบข้อผิดพลาด' });
    let response = await authService.createUser(req.body, req.auth);
    if(response.status == 0) res.status(201).json({ message: response.message });
    else if(response.status == 1) res.status(409).json({ message: response.message });
    else if(response.status == 2) res.status(403).json({ message: response.message });
    else if(response.status == 3) res.status(400).json({ message: response.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'พบข้อผิดพลาด' });
  }
}

// async function forgotPassword(req, res) {
//   try {
//     const { email } = req.body;
//     const result = await authService.forgotPassword(email);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

// async function resetPassword(req, res) {
//   try {
//     const { token, password } = req.body;
//     const result = await authService.resetPassword(token, password);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

module.exports = {
    loginByIdNumber,
    loginByEmail,
    loginByEmailAdmin,
    createUser
    // forgotPassword,
    // resetPassword,
};
