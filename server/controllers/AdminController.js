exports.isAdminCheck = async (req, res) => {
  const { email } = req.query;

  try {
    res.json({ isAdmin: process.env.MM_SYSTEM_ADMIN_USER === email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
