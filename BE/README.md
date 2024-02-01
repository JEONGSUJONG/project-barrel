<details>
<summary>📅 2024.01.31</summary>

<h1>npm 초기화 및 Express 설치</h1>

- `npm init`

  - package.json : 프로젝트의 정보와 프로젝트에서 사용 중인 패키지의 의존성을 관리하는 곳

- `npm install express`

  - express : Node.js 의 API를 단순화하고 유용한 기능들을 더 추가 시켜 Node.js 를 더 편리하고 유용하게 사용할 수 있게 해주는 모듈

- index.js 파일 생성
  - Node.js 에서 진입점이 되는 파일

<h2>라우팅 및 서버 구동</h2>

```javascript
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

//PORT
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
```

`node index.js`

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/5dfa5b4c-a604-4889-b148-3f7ea4371fb2)

- `npm install -D nodemon` : nodemon 은 Node.js 애플리케이션의 코드 변경을 감지하고 자동으로 서버를 다시 시작해주는 도구

- package.json

```json
  "scripts": {
    "dev": "nodemon src/index.js",      // 추가
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

`npm run dev`

<h1>BE Folder Structure</h1>

```
├─node_modules
├─src
    ├─middleware
    │   └─auth.js
    ├─models
    │   └─User.js
    ├─routes
    │   └─users.js
    └─index.js
├─public
    └─//static 파일
├─.env
├─.gitignore
├─package-lock.json
└─package.json
```

<h1>필요한 package 설치</h1>

- `npm install bcryptjs` : `bcryptjs` 비밀번호를 해싱을 수행하기 위한 라이브러리
- `npm install jsonwebtoken` : `jsonwebtoken` JSON 형식의 토큰을 생성하고 검증하기 위한 라이브러리. 주로 (Authentication) 을 구현할 때 사용되며 특히, 웹 토큰 (JSON Web Token)을 생성하여 사용자의 세션 상태를 유지하거나 검증할 수 있게 한다.
- `npm install cors` : Express 애플리케이션에서 클라이언트와 서버 간의 HTTP 요청에 응답하고 자원 요청을 허용하는 미들웨어
- `npm install mongoose` : MongoDB와 상호 작용하기 위한 Node.js 라이브러리.

<h1>express.static()</h1>

- express.static : 이미지, CSS 파일 및 Javascript 파일과 같은 정적 파일을 제공하려면 Express의 express.static 내장 미들웨어 기능을 사용할 수 있다.

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/8aa45f1e-9deb-40cb-9783-219769a685bc)

- index.js

```javascript
const path = require("path");

// public 폴더 안의 정적 파일 가져오기
app.use(express.static(path.join(__dirname, "../public")));
```

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/32c17f29-8f63-4044-9c41-84bd03e88bc8)

- `__dirname` : 현재 파일이 위치한 디렉토리를 의미
  - `path.join` 을 사용하여 정적 파일이 위치한 디렉토리 경로를 지정합니다.
- `"../public"` 은 정적 파일들이 위치한 디렉토리

`app.use("가상경로", express.static("public"));` : 가상경로로 사용할 수 있지만 노드 프로세스를 시작하는 디렉토리는 상대적이기에 위의 예시인 절대 경로로 사용하는 것을 권장.

<h1>Cors</h1>

- Server와 Client 간 Port가 다르거나 도메인이 다르면 즉, Origin이 다르면 Request 를 보낼 수 없다.
  - Why? 보안을 위한 Same Origin Policy 정책 때문 (동일 출처 정책)
- Cross-Origin Resource Sharing 를 사용하면 된다.
- `app.use(cors())`

<h1>Express.json</h1>

`app.use(express.json())`

```javascript
app.use(express.json());

app.post("/", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});
```

https://github.com/JEONGSUJONG/readme-main/assets/142254876/bb725cbd-f045-490d-8385-216f9922e008

<h1>mongoose</h1>

- Mongoose : 데이터를 만들고 관리하기 위해서 먼저 Schema 를 만들고 그 스키마로 모델을 만든다. 몽구스는 MongoDB 를 쓸 때 사용해도 되고 안 써도 되는 선택사항

1. 스키마를 생성한다
2. 스키마를 이용하여 모델을 만든다
3. 모델을 이용하여 데이터를 CRUD 할 수 있다.

```javascript
const mongoose = require("mongoose");

const product = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
  price: {
    type: Number
  }
  ...
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
```

- 애플리케이션 계층에서 특정 스키마를 적용

  - 모델 유효성 검사
  - MongoDB 작업을 쉽게 하기 위한 기타 기능

- Schema : Mongoose 스키마는 문서 (Document)의 구조, 기본값, 유효성 검사를 정의 (default: 0, required: true/false)
- Model : Mongoose 모델은 레코드 생성,쿼리,업데이트,삭제 등을 위한 데이터 베이스 인터페이스 제공

<h2>MongoDB Atlas Cloud Service</h2>

https://www.mongodb.com/ko-kr

로그인 -> new project -> database -> Build a Database

-> DatabaseAccess (username, password) 기억하기

```javascript
const mongoose = require("mongoose");

// mongoose
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
```

- URL : Atlas -> Deployment/Database -> Connect -> Drivers -> `Add your connection string into your application code` URL 복사 후 .env 파일에 넣기 -> URL 에 `<username>:<password>` 에 DatabaseAccess 설정한 username과 password 넣어주기

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/a6d204e6-46ca-481e-90c8-93ef31eed596)
정상적으로 연결되었다..!

- MongoDB Compass 에서도 동일한 URL 적용

<h2>User Schema 생성</h2>

- models/User.js

```javascript
const mongoose = required("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true, // 문자열 양 끝 공백 제거
    unique: 1, // 중복된 값 허용 x
  },
  password: {
    type: String,
    minLength: 5,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

<h1>Express 에러 처리</h1>

- 기본 라우트에서 에러 발생시키기
```javascript
app.get("/", (req, res) => {
  throw new Error("This is Error");
});
```

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/3400c926-ca16-40a1-b059-e38ee3b36ec5)

- 실행하면 바로 서버가 다운(Crash) 된다 (에러 처리 미들웨어 필요)

```javascript
app.get("/", (req, res) => {
  throw new Error("This is Error");
});

// 에러 처리기
app.use((error, req, res, next) => {
  res.send(error.message);
});
```

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/ff8d7f0c-ce29-45af-9497-da541b62231d)

- 위와같으면 서버가 다운 되지 않고 에러 메시지를 보여준다.
- 하지만, 비동기 요청으로 인한 에러는 에러 처리기에서 못 받는다.

```javascript
app.get("/", (req, res) => {
  setImmediate(() => {
    throw new Error("This is Error");
  });
});

app.use((error, req, res, next) => {
  res.send(error.message);
});
```

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/6c16141e-8d2c-4fa9-89ba-c326681568d2)


<h2>How to solve?</h2>

- next 이용하기

```javascript
app.get("/", (req, res, next) => {
  setImmediate(() => {
    next(new Error("This is Error"));
  });
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message || 'Internal Server Error');
});
```

</details>


<details>
<summary>📅 2024.02.01</summary>

<h1>RegisterRouter생성</h1>

- "회원가입" 을 클릭하면 client가 thunkFunction 내에서 비동기 요청을 보냄

```javascript
const response = await axiosInstance.post(`/users/register`, body);
return response.data;
```

- 서버에서 이 비동기 요청을 처리해주어야함.

- routes/user.js
```javascript
const express = require("express");
const router = express.Router();

router.post("/users/register", (req, res) => {
  // User 데이터를 저장해야함.
});


module.exports = router;
```

- index.js
```javascript
const UserRouter = require("./routes/user-router");
app.use('/api/v1/users', UserRouter);
```

- `api/v1` 으로 받으니 FE - axios.js 수정해줘야함

```javascript
baseURL: import.meta.env.PROD ? "" : "http://localhost:5000/api/v1",
```


- req.body 받기

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/9499ab40-1524-413d-aa28-44f4db7d81f1)

```javascript
router.post("/users/register", async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error)
  }
});
```

- req.body 안에 존재하는 `email` `image` `name` `password` 를 받아온다.

https://github.com/JEONGSUJONG/readme-main/assets/142254876/02c49e16-d122-44e1-8a5e-00db24e9d982


<h1>비밀번호 암호화</h1>

![image](https://github.com/JEONGSUJONG/readme-main/assets/142254876/b442d43e-184d-4837-aa61-c81d7d5b6220)

위의 DB에서는 password가 노출되어 해커가 db를 열게되면 쉽게 user의 password을 알 수 있게된다.

- bcryptjs
  - `npm install bcryptjs --save`


<h2>비밀번호 저장 방법</h2>

1. 원본 비밀번호 저장 (최악)
2. 비밀번호를 암호화 키 (Encryption Key)와 함께 암호화 (양방향)
  - 어떠한 암호를 이용해서 비밀번호를 암호화 하고 그 암호를 이용하여 복호화 가능.
    - "1234" -> 암호화(알고리즘+암호화 키) -> "qUuFwnAdNnDs"
    - "qUuFwnAdNnDs" -> 복호화 -> "1234"
  - 암호화 키가 노출되면 알고리즘은 대부분 오픈되어있어 위험함.
3. SHA256 해시(Hash)해서 저장(단방향)
  - https://emn178.github.io/online-tools/sha256
    - "1234" -> 해시 -> "qUuFwnAdNnDs"
    - "qUuFwnAdNnDs" -> 복호화 불가능!
  - 단, "1234" 와 같은 비밀번호는 "qUuFwnAdNnDs" 와 같이 암호화 되므로 레인보우 테이블(함호화 전과 후를 갖고있는 테이블)을 비교하여 찾아낼 수 있다.
4. 솔트(salt) + 비밀번호(plain pw) 를 해시로 암호화해서 저장
  - "1234" -> salt + "1234" -> 암호화된 값
  - "1234" -> salt + "1234" -> 다른 암호화된 값

- bcrypt는 salt를 사용하는 암호화 알고리즘으로 그 값을 DB에 저장하게 된다
  
<h3>UserSchema</h3>

`userSchema.pre()` : 스키마를 저장하기 전에 먼저 호출되어 해시화를 진행해준다.

- user-schema.js
```javascript
const bcrypt = require("bcryptjs");
...
userSchema.pre('save', async function (next) {
  let user = this;    // user의 data 들어감 (email, name ...)
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
})
// mogoose 하기 전에 작성해줘야함!
const User = mongoose.model("User", userSchema);
```

https://github.com/JEONGSUJONG/readme-main/assets/142254876/32c6a1a9-0cc9-4956-b36d-802beda0b619


</details>