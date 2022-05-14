from sqlalchemy.orm import Session


def get_db_item_by_id(db: Session, model, id: int, options=None):
    item = db.query(model)
    if options:
        item = item.options(options)
    return item.filter(model.id == id).first()


def get_db_items(db: Session, model, options=None):
    items = db.query(model)
    if options:
        items = items.options(options)
    return items.all()


def edit_db_item_by_id(db: Session, model, id: int, attributes: dict):
    item = db.query(model).\
        filter(model.id == id).first()
    if not item:
        return False
    for attr in attributes.keys():
        if hasattr(item, attr):
            setattr(item, attr, attributes[attr])
    db.commit()
    return item
