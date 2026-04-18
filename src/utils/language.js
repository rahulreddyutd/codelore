export const LANGUAGES = [
  "Auto-detect",
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Java",
  "Rust",
  "C++",
  "PHP",
  "Ruby",
  "SQL",
];

export const DOC_FORMATS = [
  { id: "markdown", label: "Markdown" },
  { id: "jsdoc", label: "JSDoc" },
  { id: "docstring", label: "Python Docstring" },
  { id: "godoc", label: "Go Doc" },
];

export function detectLanguage(code) {
  if (!code || code.trim().length < 10) return "Unknown";
  if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|:\s*$|^\s*class\s+\w+/m.test(code)) return "Python";
  if (/func\s+\w+|package\s+\w+|:=|fmt\.|go\s+func/m.test(code)) return "Go";
  if (/fn\s+\w+|let\s+mut|impl\s+|pub\s+fn|use\s+std/m.test(code)) return "Rust";
  if (/public\s+class|private\s+\w+|System\.out|@Override|void\s+main/m.test(code)) return "Java";
  if (/#include|std::|cout|cin|namespace|template\s*</m.test(code)) return "C++";
  if (/interface\s+\w+|type\s+\w+\s*=|:\s*string|:\s*number|:\s*boolean|<T>/m.test(code)) return "TypeScript";
  if (/function\s+\w+|const\s+\w+\s*=|=>|require\(|module\.exports/m.test(code)) return "JavaScript";
  if (/<\?php|echo\s+|->|namespace\s+App/m.test(code)) return "PHP";
  if (/def\s+\w+|end$|puts\s+|attr_accessor|\.rb/m.test(code)) return "Ruby";
  if (/SELECT|INSERT|UPDATE|DELETE|CREATE TABLE|FROM\s+\w+/im.test(code)) return "SQL";
  return "JavaScript";
}

export const SAMPLE_CODE = `// User authentication service
class AuthService {
  constructor(db, jwtSecret, bcrypt) {
    this.db = db;
    this.jwtSecret = jwtSecret;
    this.bcrypt = bcrypt;
    this.tokenExpiry = '24h';
  }

  async register(email, password, role = 'user') {
    const existing = await this.db.users.findOne({ email });
    if (existing) throw new Error('Email already registered');
    
    const hash = await this.bcrypt.hash(password, 12);
    const user = await this.db.users.create({
      email,
      password: hash,
      role,
      createdAt: new Date(),
    });
    
    return this.generateToken(user);
  }

  async login(email, password) {
    const user = await this.db.users.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    
    const valid = await this.bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    
    await this.db.users.update(user.id, { lastLogin: new Date() });
    return this.generateToken(user);
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: this.tokenExpiry }
    );
  }

  async validateToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  async resetPassword(email) {
    const user = await this.db.users.findOne({ email });
    if (!user) return;
    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.db.users.update(user.id, {
      resetToken,
      resetExpiry: Date.now() + 3600000,
    });
    return resetToken;
  }
}`;
