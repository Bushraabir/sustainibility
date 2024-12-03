from app import db, Event

event1 = Event(name='Earth Day Cleanup', date='April 22, 2024')
event2 = Event(name='Sustainable Living Workshop', date='May 10, 2024')
event3 = Event(name='Green Innovation Expo', date='June 15, 2024')

db.session.add(event1)
db.session.add(event2)
db.session.add(event3)
db.session.commit()
