"""Added User and Player tables

Revision ID: 213da07a7009
Revises:
Create Date: 2022-05-11 13:58:21.738588

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '213da07a7009'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('players',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('first_name', sa.String(), nullable=True),
                    sa.Column('last_name', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_players_id'), 'players', ['id'], unique=False)
    op.create_table('users',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('admin', sa.Boolean(), nullable=False),
                    sa.Column('number', sa.String(), nullable=False),
                    sa.Column('login_guid', sa.String(), nullable=False),
                    sa.Column('registration_date', sa.DateTime(), nullable=False),
                    sa.Column('last_activity', sa.DateTime(), nullable=False),
                    sa.Column('player_id', sa.Integer(), nullable=True),
                    sa.ForeignKeyConstraint(['player_id'], ['players.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_players_id'), table_name='players')
    op.drop_table('players')
    # ### end Alembic commands ###
