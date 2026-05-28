"""Database engine + session factory."""
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


engine = create_engine(settings.database_url, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    """All ORM models inherit from this base."""


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency: yields a session, closes it on request end."""
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    """Use in scripts (seeders, healthcheck)."""
    s = SessionLocal()
    try:
        yield s
        s.commit()
    except Exception:
        s.rollback()
        raise
    finally:
        s.close()
