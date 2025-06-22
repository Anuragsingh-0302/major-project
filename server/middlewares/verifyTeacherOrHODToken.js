// middlewares/verifyTeacherOrHODToken.js

import verifyTeacherToken from './verifyTeacherToken.js';
import verifyHODToken from './verifyHODToken.js';

const verifyTeacherOrHODToken = async (req, res, next) => {
  try {
    // Try Teacher
    await verifyTeacherToken(req, res, async () => {
      if (req.teacher) {
        // Keep existing key for old controllers
        req.user = {
          id: req.teacher._id.toString(),
          username: req.teacher.name
        };
        return next();
      }

      // Try HOD
      await verifyHODToken(req, res, () => {
        if (req.hod) {
          // Keep existing key for old controllers
          req.user = {
            id: req.hod._id.toString(),
            username: req.hod.name
          };
          return next();
        }

        return res.status(403).json({
          success: false,
          message: 'Not authorized. Only Teachers or HOD can perform this action.',
        });
      });
    });
  } catch (err) {
    console.error('verifyTeacherOrHODToken Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default verifyTeacherOrHODToken;
