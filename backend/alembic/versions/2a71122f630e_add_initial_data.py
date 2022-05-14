"""Add initial data

Revision ID: 2a71122f630e
Revises: 213da07a7009
Create Date: 2022-05-11 14:10:55.478562

"""
from alembic import op
from sqlalchemy import orm
from backend.models import create_user, create_player


# revision identifiers, used by Alembic.
revision = '2a71122f630e'
down_revision = '213da07a7009'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    session = orm.Session(bind=bind)

    # you can add yourself or other data here
    # make sure users and players have the same
    # number of elements and line up correctly
    users = ["8122197318"]
    players = [("Kyle", "Yohler")]

    for i in range(len(users)):
        player = create_player(session, players[i][0], players[i][1])
        user = create_user(session, users[i])
        user.admin = True
        user.player_id = player.id
        user.player = player

    session.commit()


def downgrade():
    bind = op.get_bind()
    session = orm.Session(bind=bind)

    session.execute("DELETE FROM users")
    session.execute("DELETE FROM players")
    session.commit()
    session.close()
