Release CAB API
===============

Tech Stack
----------

- Python/Django
- Django Rest Framework
- Postgres

URLS
----

- Backend is served on localhost:8000
- Admin site is at localhost:8000/admin
- API root is at localhost:8000/api


Views
-----

Each set of views should have 'admin' views with the `IsAdminPermission`
permission. These admin views are not currently used, but should be created for 
when administration is needed. Right now, the best way to administer the site
is to use the default Django admin site at localhost:8000/admin.