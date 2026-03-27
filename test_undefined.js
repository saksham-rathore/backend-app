import jwt from "jsonwebtoken";
try {
  jwt.sign({}, "secret", { expiresIn: undefined });
} catch (e) {
  console.log("Error:", e.message);
}
