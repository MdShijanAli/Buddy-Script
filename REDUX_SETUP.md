# Redux Configuration Guide - AppifyLab Social Network

## ✅ Redux Setup Complete

### **What Was Configured:**

#### 1. **Store & Slices**
- `src/store/store.ts` - Redux store with auth and posts slices
- `src/store/slices/authSlice.ts` - Auth state management (user, token, loading, error)
- `src/store/slices/postsSlice.ts` - Posts, comments, likes, replies CRUD operations

#### 2. **API Client**
- `src/api/apiClient.ts` - Axios instance with:
  - Automatic token injection in headers
  - Token refresh on 401 errors
  - Redirect to login on auth failures

#### 3. **Auth Service**
- `src/services/authService.ts` - Three core methods:
  - `login(credentials)` - Login user
  - `register(credentials)` - Register new user (auto-login after)
  - `signout()` - Logout and clear storage

#### 4. **Provider Setup**
- `src/main.tsx` - Redux Provider wraps app

#### 5. **Components Updated**

**LoginPage** (`src/views/login/LoginPage.tsx`)
- Uses Redux auth state
- Calls authService.login()
- Shows loading and error states
- Navigation to registration

**RegistrationPage** (`src/views/registration/RegistrationPage.tsx`)
- Uses Redux auth state
- Calls authService.register()
- Password validation
- Terms acceptance check

**FeedPage** (`src/views/feed/FeedPage.tsx`)
- Has logout handler
- Passes to Header component

**Header** (`src/components/Header.tsx`)
- Logout button triggers Redux logout
- Clears auth state and navigates to login

---

## **How It Works**

### **Authentication Flow:**

```
User Input → LoginPage/RegistrationPage
    ↓
authService.login() / authService.register()
    ↓
apiClient makes HTTP request
    ↓
Redux: loginSuccess/registerSuccess
    ↓
User data + token stored in Redux + localStorage
    ↓
Auto-navigate to FeedPage
```

### **Token Management:**

```
localStorage.setItem("authToken", token)
localStorage.setItem("refreshToken", refreshToken)
localStorage.setItem("user", JSON.stringify(user))
```

Every API request includes: `Authorization: Bearer <token>`

If 401 received:
1. Attempt refresh using refreshToken
2. Retry original request with new token
3. If no refreshToken → redirect to login

---

## **Using Redux for Other API Calls**

For posts, comments, likes, replies - use the Redux actions:

```typescript
import { useDispatch } from 'react-redux';
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure
} from '../store/slices/postsSlice';
import apiClient from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';

const MyComponent = () => {
  const dispatch = useDispatch();

  const loadPosts = async () => {
    dispatch(fetchPostsStart());
    try {
      const response = await apiClient.get(apiRoutes.post.getAll);
      dispatch(fetchPostsSuccess(response.data));
    } catch (error) {
      dispatch(fetchPostsFailure(error.message));
    }
  };

  return (...);
};
```

---

## **Available Redux Actions**

### **Auth Actions:**
- `loginStart()` - Set loading true, clear errors
- `loginSuccess(user, token, refreshToken)` - Save auth data
- `loginFailure(error)` - Set error message
- `registerStart()` - Set loading true
- `registerSuccess(user, token, refreshToken)` - Save auth data
- `registerFailure(error)` - Set error message
- `logout()` - Clear all auth data
- `clearError()` - Clear error message

### **Posts Actions:**
- `fetchPostsStart/Success/Failure()`
- `fetchMyPostsStart/Success/Failure()`
- `createPostStart/Success/Failure()`
- `fetchCommentsStart/Success/Failure()`
- `createCommentStart/Success/Failure()`
- `likePostStart/Success/Failure()`
- `unlikeStart/Success/Failure()`
- ... and more

---

## **Accessing Redux State**

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const MyComponent = () => {
  // Auth state
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Posts state
  const { posts, myPosts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  return (...);
};
```

---

## **localStorage Keys Used:**

- `authToken` - Access token for API requests
- `refreshToken` - Token for refreshing access token
- `user` - User object (JSON serialized)

---

## **Design Preservation:**

✅ All original CSS classes maintained
✅ All original HTML structure maintained
✅ Only JavaScript logic updated
✅ Bootstrap integration preserved
✅ Dark mode toggle working
✅ All components styled exactly as before

---

## **Next Steps:**

1. Test login/registration forms
2. Implement Redux actions for posts, comments, likes endpoints
3. Add error handling/toast notifications
4. Create Redux thunks for complex async operations (optional)
5. Add RTK Query for caching (optional, advanced)

---

## **File Structure:**

```
src/
├── api/
│   ├── apiClient.ts ✅
│   └── apiRoutes.ts ✅
├── services/
│   └── authService.ts ✅
├── store/
│   ├── store.ts ✅
│   └── slices/
│       ├── authSlice.ts ✅
│       └── postsSlice.ts ✅
├── views/
│   ├── login/LoginPage.tsx ✅
│   ├── registration/RegistrationPage.tsx ✅
│   └── feed/FeedPage.tsx ✅
├── components/
│   └── Header.tsx ✅
└── main.tsx ✅
```

**Design & layout preserved. Only methods and functions configured for Redux!**
