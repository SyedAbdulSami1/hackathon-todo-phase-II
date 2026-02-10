from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlmodel import Session
from models import User, UserCreate, UserResponse, UserLogin, Token, Role, UserRole, Permission, RolePermission
from db import get_session
from dependencies.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    verify_password
)

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, session: Session = Depends(get_session)):
    """Register a new user with comprehensive validation and role assignment"""
    # Check if user already exists
    from sqlmodel import select
    existing_user = session.exec(
        select(User).where((User.username == user.username) | (User.email == user.email))
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )

    # Validate role
    valid_roles = ["student", "teacher", "admin"]
    if user.role not in valid_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user

@router.post("/register-with-role", response_model=UserResponse)
def register_with_role(
    user: UserCreate,
    role_name: str = Query(None, description="Optional role name (student, teacher, admin)"),
    session: Session = Depends(get_session)
):
    """Register a new user with explicit role assignment"""
    # Check if user already exists
    from sqlmodel import select
    existing_user = session.exec(
        select(User).where((User.username == user.username) | (User.email == user.email))
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )

    # Validate role
    valid_roles = ["student", "teacher", "admin"]
    if role_name and role_name not in valid_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )

    # Use provided role or default to student
    user_role = role_name if role_name else "student"

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user_role
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user

@router.get("/users", response_model=List[UserResponse])
def get_users(current_user: User = Depends(get_current_active_user), session: Session = Depends(get_session)):
    """Get all users (admin only)"""
    # Only admin can access this endpoint
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin users can access this endpoint"
        )

    from sqlmodel import select
    users = session.exec(select(User)).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, current_user: User = Depends(get_current_active_user), session: Session = Depends(get_session)):
    """Get specific user details (admin or self only)"""
    from sqlmodel import select
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Only admin or self can access
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Only admin or the user themselves can access this endpoint"
        )

    return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """Login user and return access token with enhanced security"""
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login timestamp
    user.last_login = datetime.utcnow()
    session.add(user)
    session.commit()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.post("/token/refresh", response_model=Token)
async def refresh_token(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    """Refresh JWT token with new expiry"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        from sqlmodel import select
        user = session.exec(select(User).where(User.username == username)).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create new token with updated expiry
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer", "role": user.role}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/token/validate")
async def validate_token(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    """Validate JWT token and return user info"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        from sqlmodel import select
        user = session.exec(select(User).where(User.username == username)).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return {"valid": True, "username": user.username, "role": user.role, "is_active": user.is_active}

    except JWTError:
        return {"valid": False, "error": "Invalid token"}

@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    """Logout user (token invalidation)"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        from sqlmodel import select
        user = session.exec(select(User).where(User.username == username)).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Mark user as logged out (optional: add logout tracking)
        return {"message": "Logged out successfully"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/permissions", response_model=dict)
def get_permissions(
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Get permissions for current user or role"""
    from sqlmodel import select
    if current_user.role == "admin":
        # Admin can see all permissions
        all_permissions = []
        for role, perms in ROLE_PERMISSIONS.items():
            all_permissions.append({"role": role, "permissions": perms})
        return {"role_permissions": all_permissions}
    else:
        # Regular users see their own permissions
        return {"role": current_user.role, "permissions": ROLE_PERMISSIONS.get(current_user.role, [])}

@router.post("/permissions/setup")
def setup_permissions(
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Setup initial RBAC permissions (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can setup permissions"
        )

    # Create roles if they don't exist
    roles_to_create = ["student", "teacher", "admin"]
    for role_name in roles_to_create:
        existing_role = session.exec(select(Role).where(Role.name == role_name)).first()
        if not existing_role:
            db_role = Role(name=role_name, description=f"{role_name.capitalize()} role")
            session.add(db_role)

    session.commit()
    return {"message": "Permissions setup completed"}