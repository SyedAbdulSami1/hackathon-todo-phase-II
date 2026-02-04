from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from ..models import (
    Task, TaskCreate, TaskUpdate, TaskResponse, TaskDeleteResponse, TaskStatusResponse, TaskCreateResponse,
    User
)
from ..dependencies.auth import get_current_active_user
from ..db import get_session

router = APIRouter()

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Create a new task"""
    # Create task instance
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        user_id=current_user.id
    )

    # Add to session and commit
    try:
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Failed to create task due to database integrity constraint"
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )

    return db_task

@router.post("/create", response_model=TaskCreateResponse, status_code=status.HTTP_201_CREATED)
def create_task_detailed(
    task: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Create a new task with detailed response"""
    # Create task instance
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        user_id=current_user.id
    )

    # Add to session and commit
    try:
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Failed to create task due to database integrity constraint"
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )

    return TaskCreateResponse(
        message=f"Task '{task.title}' created successfully",
        task=db_task,
        created_at=db_task.created_at
    )

@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Get tasks for current user with optional filtering"""
    query = select(Task).where(Task.user_id == current_user.id)

    if status:
        query = query.where(Task.status == status)

    tasks = session.exec(query.offset(skip).limit(limit)).all()
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Get a specific task"""
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Update a task"""
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update fields if provided
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update timestamp
    from datetime import datetime
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{task_id}", response_model=TaskDeleteResponse)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Delete a task"""
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    # Store task info before deletion
    deleted_task_id = task.id
    deleted_task_title = task.title

    try:
        session.delete(task)
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete task due to database integrity constraint"
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete task"
        )

    from datetime import datetime
    return TaskDeleteResponse(
        message=f"Task '{deleted_task_title}' deleted successfully",
        deleted_task_id=deleted_task_id,
        deleted_at=datetime.utcnow()
    )

@router.patch("/{task_id}/status", response_model=TaskStatusResponse)
def update_task_status(
    task_id: int,
    status: str,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Update task status (quick status update)"""
    # Validate status value
    valid_statuses = ["pending", "in_progress", "completed"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Store old status for response
    old_status = task.status

    # Update status and timestamp
    task.status = status
    task.updated_at = datetime.utcnow()
    session.add(task)

    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task status"
        )

    return TaskStatusResponse(
        message=f"Task status updated from '{old_status}' to '{status}'",
        task_id=task.id,
        old_status=old_status,
        new_status=status,
        updated_at=task.updated_at
    )

@router.patch("/{task_id}/complete")
def mark_task_complete(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Mark a task as complete (convenience endpoint)"""
    return update_task_status(task_id, "completed", current_user, session)

@router.patch("/{task_id}/pending")
def mark_task_pending(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Mark a task as pending (convenience endpoint)"""
    return update_task_status(task_id, "pending", current_user, session)