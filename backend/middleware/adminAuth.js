import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized! Please Login Again" });
      }
  
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      
      if (decoded.email !== process.env.ADMIN_EMAIL || decoded.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Not Authorized! Please Login Again" });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export default adminAuth;
  