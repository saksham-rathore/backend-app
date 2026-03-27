import jwt from "jsonwebtoken";
try {
  jwt.sign({}, "secret", { expiresIn: undefined });
  console.log("No error");
} catch (e) {
  console.log("Error:", e.message);
}
