"""
    Using sqlalchemy to connect to the database, create a scoped session
    and connects that to fastapi. For more, refer to the sqlalchemy documentation [1]
    and the official fastapi docs for using sqlalchemy [2]
    [1]: https://docs.sqlalchemy.org/en/13/orm/tutorial.html
    [2]: https://fastapi.tiangolo.com/tutorial/sql-databases/
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from backend.settings import settings

engine = create_engine(settings.DatabaseUri,
                       connect_args={"check_same_thread": False},
                       convert_unicode=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

Base = declarative_base()


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
