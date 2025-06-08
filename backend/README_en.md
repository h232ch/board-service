```md
# Node.js Express Learning Process

## Step 1: Understanding Basic Structure
- Express.js application setup
  - Middleware setup (cors, express.json)
  - Route setup
  - Error handling
- Environment variable setup (.env)
- Server execution setup

## Step 2: Database
- MongoDB connection setup
  - Connection using Mongoose
  - Managing connection string via environment variables
- Model definition
  - User Model
  - Post Model

## Step 3: Authentication System
- JWT-based authentication
- User management API
  - Registration
  - Login
  - User information lookup/modification

## Step 4: API Endpoints
- RESTful API design
  - /api/users endpoint
  - /api/posts endpoint
- Request/Response handling
  - JSON data processing
  - Error response handling

## Step 5: Middleware
- CORS settings
  - Managing allowed origins
  - Restricting HTTP methods
- Logging middleware
- Error handling middleware

## Step 6: Security
- CORS security settings
- Input data validation
- Error handling and logging

## Step 7: Testing and Deployment
- API testing
- Server status monitoring
- Deployment settings

## Step 1: Understanding Basic Structure

### 1. Express.js Application Setup

#### A. Middleware Settings
1. **CORS Configuration**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```
- Allows requests only from specific domains.
- Configures allowed HTTP methods.
- Allows authentication headers.

2. **Basic Middleware**
```javascript
app.use(express.json());  // Parses JSON request bodies
```

3. **Logging Middleware**
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
```

#### B. Route Settings
```javascript
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
```
- Uses modularized routes.
- API versioning (e.g., `/api` prefix).

#### C. Error Handling
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```

### 2. Environment Variable Setup
Manage environment variables using a `.env` file:
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port
- `FRONTEND_URL`: Frontend URL

### 3. Server Execution Settings
```javascript
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
```

### Adding IP to CORS

Currently, the `allowedOrigins` array only allows the following two addresses:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  '[http://192.168.219.120:3000](http://192.168.219.120:3000)'
];
```
If the frontend's IP changes, you need to add the new address to this array. For example, if the frontend runs on `192.168.1.100:3000`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  '[http://192.168.219.120:3000](http://192.168.219.120:3000)',
  '[http://192.168.1.100:3000](http://192.168.1.100:3000)'  // Add new IP here
];
```
Failure to do so may result in CORS errors. You might see an error like this in your browser's developer console:
```
Access to fetch at 'http://your-backend-url' from origin 'http://new-frontend-ip:3000' has been blocked by CORS policy
```

## How JWT Token Works

Here's a detailed explanation of the entire JWT process with examples.

### 1. Token Creation Process

```javascript
// 1. User Information
const user = {
  _id: "123456",
  username: "john_doe"
};

// 2. JWT Token Creation
const token = jwt.sign(
  { userId: user._id },  // Payload
  "mysecret123",         // JWT_SECRET
  { expiresIn: '7d' }    // Options
);
```

What actually happens in this process:

1. **Header Creation**:
```javascript
const header = {
  "alg": "HS256",  // Hashing algorithm
  "typ": "JWT"     // Token type
};
// Base64 encoded
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

2. **Payload Creation**:
```javascript
const payload = {
  "userId": "123456",
  "iat": 1516239022,  // Issued at (timestamp)
  "exp": 1516843822   // Expiration time (7 days later)
};
// Base64 encoded
// eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjJ9
```

3. **Signature Creation**:
```javascript
// Concatenate header and payload with a dot (.)
const data = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjJ9";

// Generate HMAC SHA-256 hash with JWT_SECRET
const signature = HMACSHA256(data, "mysecret123");
// Result: "SflKxwRJSMeKKF2QT4fwpMeJf36POkO6yJV_adQssw5c"
```

4. **Final Token**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POkO6yJV_adQssw5c
```

### 2. Token Verification Process

```javascript
// 1. Client sends the token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POkO6yJV_adQssw5c";

// 2. Server verifies the token
try {
  const decoded = jwt.verify(token, "mysecret123");
  console.log(decoded);
  // Output: { userId: "123456", iat: 1516239022, exp: 1516843822 }
} catch (error) {
  console.log("Token is invalid");
}
```

What happens during the verification process:

1. **Token Separation**:
```
header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
payload = "eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjJ9"
signature = "SflKxwRJSMeKKF2QT4fwpMeJf36POkO6yJV_adQssw5c"
```

2. **Signature Verification**:
```javascript
// 1. Re-hash header and payload
const data = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjJ9";
const newSignature = HMACSHA256(data, "mysecret123");

// 2. Compare the newly created signature with the token's signature
if (newSignature === signature) {
  // If signatures match, decode the payload
  const decodedPayload = base64Decode(payload);
  // { userId: "123456", iat: 1516239022, exp: 1516843822 }
} else {
  // If signatures don't match, the token is tampered with
  throw new Error("Invalid token");
}
```

### 3. Practical Usage Example

```javascript
// 1. Token creation on login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  // User verification
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
  // Password verification
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
  // Token creation
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token });
};

// 2. Handling requests requiring authentication
const authMiddleware = (req, res, next) => {
  // Extract token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Add verified user information to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

Thus, JWT:
1. Base64 encodes the payload during token creation.
2. Hashes the signature with `JWT_SECRET`.
3. Re-calculates and compares the signature during verification.
4. Uses payload data if signatures match.

In conclusion, `JWT_SECRET` is critical for security.

## Step 2: Database

Let's move on to the database section (Step 2). First, we'll examine the MongoDB connection setup and model structure.

### 1. MongoDB Connection Setup
```javascript
// In app.js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));
```

### 2. Model Structure

#### A. User Model
```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Automatically generates createdAt, updatedAt
});
```
Features:
- Automatic password hashing (bcrypt)
- Prevention of duplicate email/username
- Tracking of last login time
- Automatic timestamp generation

#### B. Post Model
```javascript
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema]
}, {
  timestamps: true
});
```
Features:
- Includes a comment schema
- References the author (links to User model)
- Tagging functionality
- Liking functionality
- Automatic timestamp generation

### 3. Relationship Definition
- Post and User are linked by `ObjectId`.
- Comments are also linked to User.
- Likes are also linked to User.

### 4. Database Operation Examples

```javascript
// Create a user
const user = new User({
  username: "john_doe",
  email: "john@example.com",
  password: "password123"
});
await user.save();

// Create a post
const post = new Post({
  title: "My First Post",
  content: "Hello World!",
  author: user._id,
  tags: ["first", "hello"]
});
await post.save();

// Retrieve a post (including author information)
const postWithAuthor = await Post.findById(postId)
  .populate('author', 'username email')
  .populate('comments.author', 'username');
```
Advantages of this structure:
1. Data integrity ensured by schema validation.
2. Easy time tracking with automatic timestamps.
3. Convenient data retrieval with relationship definitions.
4. Enhanced security with automatic password hashing.

## Bcrypt Explanation

You're right! Bcrypt's hash value *does* include the salt.

If you look at the structure of a password hashed with bcrypt:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```
This string is composed as follows:
1. `$2a$` - Algorithm version
2. `10` - Hashing strength (cost factor)
3. `N9qo8uLOickgx2ZMRZoMye` - 22-character salt
4. `IjZAgcfl7p92ldGxad68LJZdL17lhWy` - Actual hash value

Therefore, when `bcrypt.compare()` operates:
1. It extracts the salt from the stored hash value.
2. It generates a new hash using the input password and the extracted salt.
3. It compares the newly generated hash with the stored hash.

In example code:
```javascript
// 1. When saving the password
const password = "password123";
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
// hash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// 2. When verifying the password
const isMatch = await bcrypt.compare("password123", hash);
// Internally:
// 1. Extracts salt from hash ("N9qo8uLOickgx2ZMRZoMye")
// 2. Generates new hash with "password123" + "N9qo8uLOickgx2ZMRZoMye"
// 3. Compares new hash with stored hash
```
By including the salt in the hash value:
1. There's no need to store the salt separately.
2. The same password generates different hash values.
3. Verification is possible with only the hash value.

No, including the salt in the hash value is not a security vulnerability. On the contrary, it's one of bcrypt's key security features.

Here's why:

1. **Purpose of Salt**:
   - The salt is used to ensure that the same password generates a different hash value.
   - It prevents rainbow table attacks.
   - The salt itself does not protect the password.

2. **Hash Value Structure**:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```
- Even if the salt is exposed, the password cannot be reversed.
- This is because bcrypt is a one-way hashing function.

3. **Attack Scenario**:
   - Assume an attacker obtains the hash value.
   - They can know the salt, but:
     - They don't know the password.
     - The hashing function is one-way.
     - A different salt is used for each user.
   - Therefore, only brute-force attacks are possible.
   - However, bcrypt is intentionally a slow hashing function.

4. **Bcrypt's Security Enhancements**:
   - One-way hashing (irreversible)
   - Intentionally slow hashing function
   - Different salt for each user
   - Cost factor to adjust hashing strength

For example:
```javascript
// User A's password "password123"
const hashA = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// User B's same password "password123"
const hashB = "$2a$10$DifferentSaltHereDifferentHashValue"

// Both hash values are completely different.
// Even if the salt is exposed, the password cannot be known.
```
This is why it's secure:
1. The salt doesn't protect the password itself.
2. The salt ensures the diversity of hash values.
3. The actual password is protected by the hashing function.
4. Bcrypt intentionally uses a slow hashing function.

## Reason for using Populate
The reason for using `populate` is to handle reference relationships in MongoDB.

Looking at the Post model:
```javascript
const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Stores only the User model's ID
    ref: 'User',
    required: true
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,  // Stores only the User model's ID
      ref: 'User',
      required: true
    }
  }]
});
```
Here, `author` and `comments.author` store only the User's ID, not the actual User object.

For example:
```javascript
// Actual data stored in DB
{
  _id: "post123",
  title: "My Post",
  author: "user456",  // Only User ID is stored
  comments: [
    {
      content: "Great post!",
      author: "user789"  // Only User ID is stored
    }
  ]
}
```
If you don't use `populate`:
```javascript
const post = await Post.findById(req.params.id);
// Result:
{
  _id: "post123",
  title: "My Post",
  author: "user456",  // Only ID is present
  comments: [
    {
      content: "Great post!",
      author: "user789"  // Only ID is present
    }
  ]
}
```
If you use `populate`:
```javascript
const post = await Post.findById(req.params.id)
  .populate('author', 'username')  // Converts the author field's ID to an actual User object
  .populate('comments.author', 'username');  // Also converts the author in comments

// Result:
{
  _id: "post123",
  title: "My Post",
  author: {
    _id: "user456",
    username: "john_doe"  // Actual user information
  },
  comments: [
    {
      content: "Great post!",
      author: {
        _id: "user789",
        username: "jane_doe"  // Actual user information
      }
    }
  ]
}
```
The reasons for doing this are:
1. **Data Normalization**: Prevents storing duplicate data.
2. **Data Consistency**: If user information changes, only one place needs to be updated.
3. **Efficient Storage**: Stores only necessary information.
4. **Flexible Retrieval**: Allows selectively fetching only the required information.

The reason for using `select: 'username'` is:
1. To reduce network traffic by fetching only necessary fields.
2. To prevent exposure of sensitive information (email, password, etc.).
3. To optimize the size of the response data.

## Step 3: Authentication System

Let's look at Step 3: Authentication System.

### 1. User Registration (Register)
```javascript
// backend/src/controllers/userController.js
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check for duplicate users
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create a new user
    const user = new User({ username, email, password });
    await user.save();

    // 3. Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // 4. Respond
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};
```

### 2. User Login (Login)
```javascript
// backend/src/controllers/userController.js
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    // 4. Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // 5. Respond
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
```

### 3. Authentication Middleware
```javascript
// backend/src/middleware/auth.js
const auth = async (req, res, next) => {
  try {
    // 1. Extract token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }

    // 4. Add user information to the request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};
```

### 4. User Profile Lookup
```javascript
// backend/src/controllers/userController.js
const getProfile = async (req, res) => {
  try {
    // 1. Retrieve user information (excluding password)
    const user = await User.findById(req.user._id).select('-password');
    
    // 2. Respond
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};
```

Features of this authentication system:
1. JWT-based authentication
2. Password hashing (bcrypt)
3. Token expiration time setting (7 days)
4. Tracking of last login time
5. Exclusion of sensitive information (e.g., password)

API Endpoints:
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- GET `/api/users/profile` - Profile lookup (requires authentication)

## How auth.js works

Let's explain the entire authentication flow starting from routing.

### 1. Route Configuration

```javascript
// backend/src/routes/userRoutes.js
const router = express.Router();

// Routes that do not require authentication
router.post('/register', register);  // User registration
router.post('/login', login);        // User login

// Routes that require authentication
router.get('/profile', auth, getProfile);  // Profile lookup
```

```javascript
// backend/src/routes/postRoutes.js
const router = express.Router();

// Routes that do not require authentication
router.get('/', getPosts);           // Get post list
router.get('/:id', getPost);         // Get post details

// Routes that require authentication
router.post('/', auth, createPost);  // Create post
router.put('/:id', auth, updatePost);  // Update post
router.delete('/:id', auth, deletePost);  // Delete post

// Comment related endpoints
router.post('/:id/comments', auth, addComment);  // Add comment
router.put('/:id/comments/:commentId', auth, editComment);  // Edit comment
router.delete('/:id/comments/:commentId', auth, deleteComment);  // Delete comment

// Reply related endpoints
router.post('/:id/comments/:commentId/replies', auth, addReply);  // Add reply
router.put('/:id/comments/:commentId/replies/:replyId', auth, editReply);  // Edit reply
router.delete('/:id/comments/:commentId/replies/:replyId', auth, deleteReply);  // Delete reply

// Like related endpoints
router.post('/:id/like', auth, likePost);  // Like post
```

### 2. Authentication Middleware Operation

```javascript
// backend/src/middleware/auth.js
const auth = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }

    // 4. Add user information to the request object
    req.user = user;
    req.token = token;
    next();  // Proceed to the next middleware/controller
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};
```

### 3. Overall Request Processing Flow

1. **Requests that do not require authentication** (e.g., fetching post list)
```
Client → GET /api/posts → Express Router → getPosts Controller → Response
```

2. **Requests that require authentication** (e.g., creating a post)
```
Client → POST /api/posts → Express Router → auth Middleware → createPost Controller → Response
```

### 4. Practical Example

```javascript
// 1. Get post list (authentication not required)
fetch('/api/posts')
  .then(res => res.json())
  .then(posts => console.log(posts));

// 2. Create a post (authentication required)
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Post',
    content: 'Hello World'
  })
})
.then(res => res.json())
.then(post => console.log(post));
```

### 5. On Authentication Failure

```javascript
// If token is missing or invalid
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer invalid_token'
  }
})
.then(res => {
  if (res.status === 401) {
    // Authentication failed
    // Redirect to login page
  }
});
```
Thus:
1. The router decides whether to use the `auth` middleware.
2. Requests requiring authentication pass through the `auth` middleware.
3. The `auth` middleware verifies the token and adds user information to the request object.
4. The controller uses `req.user` to access user information.

## Step 4: API Endpoints

Let's examine Step 4: API Endpoints. We'll start by looking at the currently implemented API endpoints.

### 1. Users API Endpoints
```javascript
// backend/src/routes/userRoutes.js
const router = express.Router();

// Endpoints that do not require authentication
router.post('/register', register);  // User registration
router.post('/login', login);        // User login

// Endpoints that require authentication
router.get('/profile', auth, getProfile);  // Profile lookup
```

### 2. Posts API Endpoints
```javascript
// backend/src/routes/postRoutes.js
const router = express.Router();

// Endpoints that do not require authentication
router.get('/', getPosts);           // Get list of posts
router.get('/:id', getPost);         // Get post details

// Endpoints that require authentication
router.post('/', auth, createPost);  // Create post
router.put('/:id', auth, updatePost);  // Update post
router.delete('/:id', auth, deletePost);  // Delete post

// Comment related endpoints
router.post('/:id/comments', auth, addComment);  // Add comment
router.put('/:id/comments/:commentId', auth, editComment);  // Edit comment
router.delete('/:id/comments/:commentId', auth, deleteComment);  // Delete comment

// Reply related endpoints
router.post('/:id/comments/:commentId/replies', auth, addReply);  // Add reply
router.put('/:id/comments/:commentId/replies/:replyId', auth, editReply);  // Edit reply
router.delete('/:id/comments/:commentId/replies/:replyId', auth, deleteReply);  // Delete reply

// Like related endpoints
router.post('/:id/like', auth, likePost);  // Like post
```

### 3. API Request/Response Examples

#### A. User Registration
```javascript
// Request
POST /api/users/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user123",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-03-20T12:00:00.000Z",
    "updatedAt": "2024-03-20T12:00:00.000Z"
  }
}
```

#### B. Create Post
```javascript
// Request
POST /api/posts
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
{
  "title": "My First Post",
  "content": "Hello World!",
  "tags": ["first", "hello"]
}

// Response
{
  "message": "Post created successfully",
  "post": {
    "_id": "post123",
    "title": "My First Post",
    "content": "Hello World!",
    "author": {
      "_id": "user123",
      "username": "john_doe"
    },
    "tags": ["first", "hello"],
    "createdAt": "2024-03-20T12:00:00.000Z"
  }
}
```

#### C. Add Comment
```javascript
// Request
POST /api/posts/post123/comments
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
{
  "content": "Great post!"
}

// Response
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "comment123",
    "content": "Great post!",
    "author": {
      "_id": "user123",
      "username": "john_doe"
    },
    "createdAt": "2024-03-20T12:00:00.000Z"
  }
}
```

### 4. Error Handling

```javascript
// 400 Bad Request
{
  "message": "Invalid input data",
  "errors": {
    "username": "Username is required",
    "email": "Invalid email format"
  }
}

// 401 Unauthorized
{
  "message": "Please authenticate"
}

// 403 Forbidden
{
  "message": "You don't have permission to perform this action"
}

// 404 Not Found
{
  "message": "Post not found"
}

// 500 Internal Server Error
{
  "message": "Something went wrong",
  "error": "Error message details"
}
```

### 5. RESTful API Design Principles

1. **Resource-based URLs**:
   - `/api/posts` - Post resource
   - `/api/posts/:id/comments` - Comment resource

2. **Use of HTTP Methods**:
   - GET: Retrieve
   - POST: Create
   - PUT: Update
   - DELETE: Delete

3. **Hierarchical Structure**:
   - Post → Comment → Reply

4. **Consistent Response Format**:
   - Success: `{ message, data }`
   - Failure: `{ message, error }`

5. **Use of Status Codes**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

Advantages of this API structure:
1. Intuitive URL structure
2. Consistent response format
3. Clear error handling
4. Hierarchical resource structure
5. Adherence to RESTful principles

## UserController

Here's a detailed explanation of each function in `userController.js`:

### 1. User Registration (register)
```javascript
// backend/src/controllers/userController.js
const register = async (req, res) => {
  try {
    // 1. Extract request data
    const { username, email, password } = req.body;

    // 2. Check for duplicate user
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // 3. Create new user
    const user = new User({ username, email, password });
    await user.save();

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Respond
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};
```

### 2. User Login (login)
```javascript
// backend/src/controllers/userController.js
const login = async (req, res) => {
  try {
    // 1. Extract request data
    const { email, password } = req.body;

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // 4. Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Respond
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
};
```

### 3. Get Profile (getProfile)
```javascript
// backend/src/controllers/userController.js
const getProfile = async (req, res) => {
  try {
    // 1. Retrieve user information (excluding password)
    const user = await User.findById(req.user._id)
      .select('-password');

    // 2. Respond
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};
```

### Key Features

1. **Error Handling**:
   - All errors handled with try-catch.
   - Appropriate HTTP status codes used.
   - Error messages included.

2. **Security**:
   - Passwords not included in responses.
   - JWT token usage.
   - Duplicate user check.

3. **Data Validation**:
   - Email/username duplication check.
   - Password verification.

4. **Response Format**:
   - Consistent JSON response structure.
   - Only necessary information included.
   - Clear messages.

5. **Status Codes**:
   - 201: Created successfully.
   - 400: Bad request.
   - 401: Authentication failed.
   - 500: Server error.

## Step 5: Middleware

Let's examine Step 5: Middleware. We'll start by looking at the middleware settings in `app.js`.

### 1. CORS Configuration
```javascript
// backend/src/app.js
const corsOptions = {
  // 1. Allowed Origins Settings
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  // 2. Allowed HTTP Methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // 3. Allowed Headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // 4. Allow Credentials
  credentials: true,
  
  // 5. OPTIONS Request Status Code
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```
CORS configuration features:
1. Allows only specific domains.
2. Allows only necessary HTTP methods.
3. Allows only necessary headers.
4. Allows sending authentication credentials.

### 2. Logging Middleware
```javascript
// backend/src/app.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
```
Logging middleware features:
1. Logs all requests.
2. Includes a timestamp.
3. Records HTTP method and URL.
4. Supports asynchronous processing.

### 3. Error Handling Middleware
```javascript
// backend/src/app.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```
Error handling middleware features:
1. Catches all errors.
2. Logs stack traces.
3. Sends error responses to clients.
4. Returns a 500 status code.

### 4. Other Middleware

```javascript
// JSON parsing middleware
app.use(express.json());

// Route middleware
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
```

### 5. Middleware Execution Order

1. CORS Middleware
   - Checks the origin of the request.
   - Validates if it's an allowed domain.

2. JSON Parsing Middleware
   - Parses the request body as JSON.
   - Adds data to `req.body`.

3. Logging Middleware
   - Records request information.
   - Facilitates debugging.

4. Route Middleware
   - Forwards the request to the appropriate route.
   - Executes the controller.

5. Error Handling Middleware
   - Handles any errors that occur.
   - Sends error responses.

### 6. Middleware Usage Example

```javascript
// 1. CORS Request
fetch('http://localhost:8080/api/posts', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Log Output
// 2024-03-20T12:00:00.000Z - GET /api/posts

// 3. On Error
// 2024-03-20T12:00:00.000Z - Error: Not allowed by CORS
// { message: 'Something went wrong!' }
```
Advantages of this middleware structure:
1. Enhanced security (CORS)
2. Easy debugging (logging)
3. Consistent error handling
4. Standardized request/response processing
5. Code reusability

## CORS (Cross-Origin Resource Sharing)

CORS (Cross-Origin Resource Sharing) is a security policy in web browsers.

### Why CORS is Needed

Let's take an example:
1. Frontend: `http://localhost:3000` (React app)
2. Backend: `http://localhost:8080` (Express server)

When the frontend sends an API request to the backend:
```javascript
// Frontend code (http://localhost:3000)
fetch('http://localhost:8080/api/posts')
  .then(res => res.json())
  .then(data => console.log(data));
```
This request is a **Cross-Origin** request:
- Origin = Protocol + Domain + Port
- `http://localhost:3000` ≠ `http://localhost:8080`

### What if there was no CORS?

There could be malicious websites:
```javascript
// Malicious website ([http://evil.com](http://evil.com))
fetch('[http://your-bank.com/api/transfer](http://your-bank.com/api/transfer)', {
  method: 'POST',
  body: JSON.stringify({
    to: 'hacker',
    amount: 1000000
  })
});
```
To prevent such situations, browsers:
1. Block cross-origin requests by default.
2. Allow access only to origins explicitly permitted by the server.

### CORS Configuration Example

```javascript
// backend/src/app.js
const corsOptions = {
  // 1. List of allowed origins
  origin: [
    'http://localhost:3000',        // Development environment
    '[http://192.168.219.120:3000](http://192.168.219.120:3000)',  // Local network
    '[https://your-domain.com](https://your-domain.com)'       // Production environment
  ],

  // 2. Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  // 3. Allowed headers
  allowedHeaders: ['Content-Type', 'Authorization'],

  // 4. Allow credentials (cookies, HTTP authentication)
  credentials: true
};

app.use(cors(corsOptions));
```

### How CORS Works

1. **Simple Request**:
```javascript
// Frontend
fetch('http://localhost:8080/api/posts')
  .then(res => res.json());
```
- GET, POST, HEAD methods.
- Uses only basic headers.
- Browser automatically checks CORS.

2. **Preflight Request**:
```javascript
// Frontend
fetch('http://localhost:8080/api/posts', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  }
});
```
- Sends an OPTIONS request first.
- Checks if the server allows the actual request.
- If allowed, the actual request is sent.

### CORS Error Examples

```javascript
// 1. Origin not allowed
Access to fetch at 'http://localhost:8080/api/posts' from origin 
'[http://evil.com](http://evil.com)' has been blocked by CORS policy

// 2. Method not allowed
Method PUT is not allowed by Access-Control-Allow-Methods

// 3. Header not allowed
Header 'X-Custom-Header' is not allowed by Access-Control-Allow-Headers
```

### Advantages of CORS

1. **Enhanced Security**:
   - Only allowed origins can access.
   - Prevents CSRF attacks.
   - Prevents data leakage.

2. **Clear Access Control**:
   - Explicitly defines which origins can access.
   - Explicitly defines which methods are allowed.
   - Explicitly defines which headers are allowed.

3. **Flexible Configuration**:
   - Configuration per development/production environment.
   - Allows multiple origins.
   - Allows only necessary features.

Yes, let's explain CORS more simply.

### 1. Situations where CORS is needed

For example, imagine you are building a website:

```
Frontend: http://localhost:3000 (React app)
Backend: http://localhost:8080 (Express server)
```

When the frontend requests data from the backend:
```javascript
// Frontend code
fetch('http://localhost:8080/api/posts')
  .then(res => res.json())
  .then(posts => console.log(posts));
```
This request is a **cross-origin** request:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- The port is different, so it's a different origin.

### 2. What if there was no CORS?

Assume there's a malicious website:
```
Malicious site: [http://evil.com](http://evil.com)
```

This site could send requests to your backend:
```javascript
// Code from the malicious site
fetch('http://localhost:8080/api/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Hacked Post',
    content: 'This is a hack'
  })
});
```
To prevent such situations, browsers:
1. Block cross-origin requests by default.
2. Allow access only if the server explicitly says "this origin is okay!".

### 3. How to configure CORS

```javascript
// backend/src/app.js
const corsOptions = {
  // 1. List of allowed origins
  origin: [
    'http://localhost:3000',  // Development environment
    '[https://your-site.com](https://your-site.com)'   // Actual site
  ],

  // 2. Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  // 3. Allow credentials (cookies, etc.)
  credentials: true
};

app.use(cors(corsOptions));
```

### 4. Practical examples

1. **Normal request**:
```javascript
// Frontend (http://localhost:3000)
fetch('http://localhost:8080/api/posts')
  .then(res => res.json())
  .then(posts => console.log(posts));
```
- Browser: "This request came from an allowed origin!"
- Server: "Yes, it's okay!"
- Result: Request successful

2. **Malicious request**:
```javascript
// Malicious site ([http://evil.com](http://evil.com))
fetch('http://localhost:8080/api/posts')
  .then(res => res.json())
  .then(posts => console.log(posts));
```
- Browser: "This request came from an unauthorized origin!"
- Server: Cannot even send a response.
- Result: CORS error occurs.

### 5. Limitations of CORS

CORS only works in browsers:
1. Requests via browser → CORS applies.
2. Requests from outside browser → CORS does not apply.

For example:
```bash
# curl request
curl http://localhost:8080/api/posts
```
- CORS policy is not applied.
- The server can receive the request.

### 6. Real security

CORS is just basic security; real security should be handled on the server:

```javascript
// 1. Authentication check
app.use('/api/posts', auth, postRoutes);

// 2. Request limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Maximum requests per IP
}));
```

### Summary

1. CORS is:
   - A browser security policy.
   - Restricts requests from different origins.
   - Allows access only to allowed origins.

2. CORS configuration involves:
   - Which origins to allow.
   - Which methods to allow.
   - Whether to allow credentials.

3. Real security involves:
   - Authentication/authorization on the server.
   - API security.
   - Request limiting.

## Step 6: Security

Let's examine Step 6: Security. We'll start by looking at the currently implemented security-related code.

### 1. CORS Security Configuration
```javascript
// backend/src/app.js
const corsOptions = {
  // 1. Restrict allowed origins
  origin: [
    'http://localhost:3000',
    '[http://192.168.219.120:3000](http://192.168.219.120:3000)'
  ],

  // 2. Restrict allowed methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // 3. Restrict allowed headers
  allowedHeaders: ['Content-Type', 'Authorization'],

  // 4. Set credentials
  credentials: true
};

app.use(cors(corsOptions));
```

### 2. Input Data Validation
```javascript
// backend/src/controllers/userController.js
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check for duplicate users
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // 2. Create a new user
    const user = new User({ username, email, password });
    await user.save();
    // ...
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};
```

### 3. Error Handling and Logging
```javascript
// backend/src/app.js
// 1. Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 2. Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```

### 4. Proposed Additional Security Settings

1. **Add Rate Limiting**:
```javascript
// backend/src/app.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Max requests per IP
});

app.use(limiter);
```

2. **Use Helmet**:
```javascript
// backend/src/app.js
const helmet = require('helmet');

app.use(helmet()); // Set security headers
```

3. **Enhance Input Data Validation**:
```javascript
// backend/src/middleware/validator.js
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

4. **Enhance Error Logging**:
```javascript
// backend/src/middleware/errorLogger.js
const errorLogger = (err, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack,
    user: req.user ? req.user._id : 'anonymous'
  });
  next(err);
};

app.use(errorLogger);
```

### 5. Security Checklist

1. **CORS Security**:
   - Only allowed origins configured.
   - Only necessary methods allowed.
   - Only necessary headers allowed.

2. **Input Data Validation**:
   - All input data validated.
   - SQL injection prevention.
   - XSS attack prevention.

3. **Error Handling**:
   - Sensitive error information hidden.
   - Proper error logging.
   - User-friendly error messages.

4. **Authentication/Authorization**:
   - JWT token verification.
   - Password hashing.
   - Session management.

5. **Additional Security**:
   - Rate limiting.
   - Security headers.
   - HTTPS usage.

### 6. Security Monitoring

```javascript
// backend/src/middleware/securityMonitor.js
const securityMonitor = (req, res, next) => {
  // 1. Request monitoring
  console.log({
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });

  // 2. Suspicious request detection
  if (isSuspiciousRequest(req)) {
    console.warn('Suspicious request detected:', req);
  }

  next();
};

app.use(securityMonitor);
```
Advantages of this security structure:
1. Multi-layered security
2. Real-time monitoring
3. Automated validation
4. Detailed logging
5. Extensible structure

## User Model Operation (Mongoose)

Yes, you've understood correctly! Let's explain the Mongoose model and instance creation process in detail.

### 1. User Model Definition
```javascript
// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Model creation
const User = mongoose.model('User', userSchema);
```

### 2. Instance Creation Process

```javascript
// 1. When calling new User()
const user = new User({ 
  username: "john_doe", 
  email: "john@example.com", 
  password: "password123" 
});

// What happens internally:
// 1. Mongoose creates a new document instance based on userSchema.
// 2. Initializes the document with the input data.
// 3. Applies default values, validation, etc., defined in the schema.
```

### 3. save() Method

```javascript
// 2. When calling user.save()
await user.save();

// What happens internally:
// 1. Executes pre('save') hook defined in the schema.
// 2. Validates data.
// 3. Actually saves to MongoDB.
// 4. Executes post('save') hook.
```

### 4. Practical Example

```javascript
// backend/src/controllers/userController.js
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Create a new User instance
    const user = new User({ 
      username, 
      email, 
      password 
    });
    // At this point, it's not yet saved to the DB.
    // It exists only in memory.

    // 2. Call save() to store in DB
    await user.save();
    // At this point, it is actually saved to the DB.
    // The pre('save') hook is executed, and the password is hashed.

    // 3. Return the created user information
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,  // ID generated by MongoDB
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};
```

### 5. Special Mongoose Features

1. **Schema Methods**:
```javascript
// Add method to User model
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Usage
const isMatch = await user.comparePassword("password123");
```

2. **Middleware (Hooks)**:
```javascript
// Hook executed before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Password hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

3. **Virtual Fields**:
```javascript
// Fields not actually stored in the DB
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

### 6. Advantages of Mongoose

1. **Object-Oriented**:
   - Can be treated like JavaScript objects.
   - Methods and properties can be added.

2. **Schema-based**:
   - Defines data structure.
   - Type validation.
   - Default value settings.

3. **Middleware Support**:
   - Pre/post save processing.
   - Validation.
   - Data transformation.

4. **Query Builder**:
   - Chaining queries.
   - Easy to write complex queries.

## Step 7: Testing and Deployment

Let's look at Step 7: Testing and Deployment. Each part will be explained in detail.

### 1. API Testing

1. **Unit Testing with Jest**:
```javascript
// backend/src/tests/user.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('User API Tests', () => {
  // Clear DB before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // User registration test
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  // Login test
  test('should login existing user', async () => {
    // First, create a user
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

2. **API Testing with Postman**:
```json
// backend/postman/board-service.postman_collection.json
{
  "info": {
    "name": "Board Service API",
    "schema": "[https://schema.getpostman.com/json/collection/v2.1.0/collection.json](https://schema.getpostman.com/json/collection/v2.1.0/collection.json)"
  },
  "item": [
    {
      "name": "User Management",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/users/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
        // ... (other API endpoint tests can be added)
      ]
    }
  ]
}
```
- Using Postman, you can actually call the API, check responses, and easily test various scenarios (normal/error).

---

### 2. Deployment

1. **Environment Variable Management**
   - Store sensitive information like DB address, JWT secret, and port in a `.env` file.
   - Example:
     ```
     MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/board
     JWT_SECRET=your_jwt_secret
     PORT=8080
     ```

2. **Production Build and Execution**
   - `npm run build` (if there's a frontend)
   - `npm start` or `node src/app.js`

3. **Server Deployment**
   - Upload to a cloud service (AWS, GCP, Azure, Vercel, Heroku, etc.) or VPS (Virtual Private Server).
   - Example: Heroku deployment
     ```bash
     heroku create board-service
     heroku config:set MONGODB_URI=...
     git push heroku main
     ```

4. **Process Manager Usage**
   - Manage the server stably with PM2 or similar tools.
     ```bash
     npm install pm2 -g
     pm2 start src/app.js --name board-service
     pm2 save
     pm2 startup
     ```

5. **HTTPS Application**
   - Apply SSL certificate with Let's Encrypt or similar.
   - Configure reverse proxy with Nginx, Apache, etc.

---

### 3. Post-Deployment Checklist

- Verify API normal operation (automated/manual testing).
- Re-check security settings (environment variables, CORS, authentication, etc.).
- Configure logging and monitoring.
- Plan for backup and disaster recovery.

## API tests

Below are 10 examples of frequently used API test scenarios for a "bulletin board service."
Each example provides the request method, URL, Body, and description for use in Postman.

---

### 1. Register User
- **Method:** POST
- **URL:** http://localhost:8080/api/users/register
- **Body (JSON):**
```json
{
  "username": "testuser1",
  "email": "test1@example.com",
  "password": "password123"
}
```
- **Description:** Registers a new user.

---

### 2. Login User
- **Method:** POST
- **URL:** http://localhost:8080/api/users/login
- **Body (JSON):**
```json
{
  "email": "test1@example.com",
  "password": "password123"
}
```
- **Description:** Logs in a registered user. (Receives a JWT token in the response)

---

### 3. Get My Profile
- **Method:** GET
- **URL:** http://localhost:8080/api/users/me
- **Headers:**
  - Authorization: Bearer {JWT_TOKEN}
- **Description:** Retrieves the information of the logged-in user.

---

### 4. Get Posts
- **Method:** GET
- **URL:** http://localhost:8080/api/posts
- **Description:** Retrieves a list of all posts.

---

### 5. Create Post
- **Method:** POST
- **URL:** http://localhost:8080/api/posts
- **Headers:**
  - Authorization: Bearer {JWT_TOKEN}
- **Body (JSON):**
```json
{
  "title": "First Post",
  "content": "This is the content of the post."
}
```
- **Description:** Creates a new post.

---

### 6. Get Post Detail
- **Method:** GET
- **URL:** http://localhost:8080/api/posts/1
- **Description:** Retrieves the detailed information of a specific post. (1 is the post ID)

---

### 7. Update Post
- **Method:** PUT
- **URL:** http://localhost:8080/api/posts/1
- **Headers:**
  - Authorization: Bearer {JWT_TOKEN}
- **Body (JSON):**
```json
{
  "title": "Updated Post Title",
  "content": "Updated post content."
}
```
- **Description:** Updates a specific post.

---

### 8. Delete Post
- **Method:** DELETE
- **URL:** http://localhost:8080/api/posts/1
- **Headers:**
  - Authorization: Bearer {JWT_TOKEN}
- **Description:** Deletes a specific post.

---

### 9. Add Comment
- **Method:** POST
- **URL:** http://localhost:8080/api/posts/1/comments
- **Headers:**
  - Authorization: Bearer {JWT_TOKEN}
- **Body (JSON):**
```json
{
  "content": "This is a comment."
}
```
- **Description:** Adds a comment to a specific post.

---

### 10. Delete Comment
- **Method:** DELETE
- **URL:** http://localhost:8080/api/posts/1/comments/5
- **Headers:**
  - Authorization: Bearer {JWT_TOKEN}
- **Description:** Deletes a specific comment from a specific post. (1 is the post ID, 5 is the comment ID)

---

#### Note
- `{JWT_TOKEN}` should be replaced with the token received upon login.
- Actual API paths (e.g., `/api/posts/1`) may vary depending on the project's routing.
- Saving each request as a "collection" in Postman makes repeated testing convenient.

## Production Environment Configuration

Yes, that's correct!
The most common setup is to place **Nginx as a reverse proxy in front of the Node.js (Express) server.**

---

## Architecture Diagram

```
[Internet User]
        │
   (Port 80/443)
        │
   [ Nginx Server ]
        │
   (Internal Port, e.g., 8080)
        │
 [ Node.js (Express) Server ]
```

---

## How it Works

1. **User** accesses `http://yourdomain.com` or `https://yourdomain.com`.
2. **Nginx** receives the request on port 80 (HTTP) or 443 (HTTPS).
3. Nginx forwards (proxies) the request to the internal Node.js server (e.g., `localhost:8080`).
4. Node.js generates the response, which Nginx then forwards back to the user.

---

## Nginx Reverse Proxy Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;  # Proxy to Node.js server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Summary of Advantages

- **Security**: Node.js server is not directly exposed to the outside.
- **HTTPS Handling**: Allows applying SSL certificates and automatic redirection.
- **Static Files**: Nginx can serve static files quickly.
- **Load Balancing**: Can distribute requests across multiple Node.js servers.

---

**In short, having Nginx in front of your Node.js server, with Nginx receiving all external requests and forwarding them to Node.js, is the standard setup!**

## User Traffic Flow

Excellent question!
Below is a step-by-step diagram illustrating the entire flow from **User → Frontend (React) → Backend (Node.js)**.

---

## Overall Flow Diagram

```
[Internet User]
        │
   (Port 80/443)
        │
   [ Nginx Server ]
      │        │
      │        └─> [ Node.js (Express) API Server ] (Port 8080)
      └─> [ Static Files (React build) ]
```

---

## 1. User Access

- **User** accesses `http://yourdomain.com` in their browser.
- Nginx receives the request on port 80 (HTTP) or 443 (HTTPS).

---

## 2. Nginx Processing

- **Nginx** analyzes the request:
  - Requests starting with `/api/` → Proxies to Node.js (Express).
  - All other requests → Responds with the React build output (static files).

---

## 3. Frontend (React) Processing

- **React app** is loaded in the browser.
- **React Router** renders the appropriate page based on the URL.
- If **API calls** are needed, requests are sent to the backend.

---

## 4. Backend (Node.js) Processing

- **Node.js (Express)** receives the API request.
- Handles **DB queries**, **business logic**, **authentication**, etc.
- Returns the **response** in JSON format.

---

## 5. Response Delivery

- The response is delivered from **Node.js** → **Nginx** → **User**.
- **React app** receives the response and updates the UI.

---

## 6. Practical Examples

### 1) User accesses login page
- Accesses `http://yourdomain.com/login`.
- Nginx responds with the React build output (`index.html`).
- React app renders the login page.

### 2) User attempts to log in
- React app calls the `/api/login` API.
- Nginx proxies the request to Node.js.
- Node.js handles authentication and returns a JWT token.
- React app stores the token and redirects to the main page.

### 3) User views post list
- React app calls the `/api/posts` API.
- Nginx proxies the request to Node.js.
- Node.js retrieves the post list from the DB and returns it.
- React app renders the post list.

---

## 7. Advantages

- **Security**: Node.js server is not directly exposed to the outside.
- **Performance**: Static files are served quickly by Nginx.
- **HTTPS**: SSL certificates can be applied via Nginx.
- **Caching/Compression**: Performance optimization possible with Nginx settings.

---

## 8. Conclusion

- **Nginx** acts as the **central gateway** connecting the frontend (React) and backend (Node.js).
- **Frontend** static files are served directly by Nginx.
- **Backend** API requests are proxied by Nginx.

## `proxy_set_header X-Real-IP $remote_addr;` # Pass User IP

Excellent question!
**`proxy_set_header X-Real-IP $remote_addr;`** is used to **pass the user's actual IP address** to the Node.js server.

---

## 1. Why is it needed?

### 1) IP-based functionality
- **Logging**: To record user IPs in logs for tracking.
- **Access Restriction**: To allow/block access only from specific IPs.
- **Location-based Services**: To provide services based on IP location.

### 2) Problem Scenario
- When **Nginx** acts as an intermediary, Node.js perceives the request as coming from **Nginx**.
- Node.js cannot know the user's actual IP (`$remote_addr`).
- → The **`X-Real-IP` header** is used to pass the user's IP.

---

## 2. Practical Example

### 1) Nginx Configuration
```nginx
location /api/ {
    proxy_pass http://localhost:8080;
    proxy_set_header X-Real-IP $remote_addr;  # Pass user IP
}
```

### 2) Checking IP in Node.js (Express)
```javascript
app.get('/api/users', (req, res) => {
    const userIP = req.headers['x-real-ip'];  // Check user IP
    console.log('User IP:', userIP);
    // ... rest of the code
});
```

---

## 3. Advantages

- **Accurate Logging**: Records user IP accurately.
- **Security**: Enables IP-based access restrictions.
- **Analytics**: Useful for user behavior analysis.

---

## 4. Conclusion

- The **`X-Real-IP` header** passes the user's actual IP to Node.js.
- It is essential for **IP-based functionalities** (logging, access restriction, location-based services, etc.).
```