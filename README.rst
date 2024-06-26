Release CAB -  Open Source Release Management Software
======================================================

Release CAB is a software release management and change advisory board (CAB)
software aimed towards simplifying and creating an auditable software release process.

Features Include:

- Ability to create releases and blackouts
- Calendar display of releases and blackouts
- Guards to prevent releases from being created during blackout periods
- Customization of your release climate (release environments, release types, release stages)
- Workflow designer to determine if and when an approval is needed to progress a release to a new stage
- Permissions configurable down to role/team

.. image:: https://github.com/ReleaseCAB/releasecab-app/blob/main/docs/images/releases_screenshot.png

.. image:: https://github.com/ReleaseCAB/releasecab-app/blob/main/docs/images/blackouts_screenshot.png

.. image:: https://github.com/ReleaseCAB/releasecab-app/blob/main/docs/images/workflow_designer_screenshot.png

Continuous Integration Status:
------------------------------

Backend Tests:

.. image:: https://github.com/ReleaseCAB/releasecab-app/blob/main/releasecab_api/coverage.svg

Tech Stack
----------

- Python/Django REST API
- React/NextJS/Chakra UI
- Postgres
- Docker/docker-compose for containerization

Alpha Status
------------

Release CAB is currently in an Alpha release and is by no means feature complete or bug free. See roadmap below for 
where we plan to move from here.


Setup For Clean Install
------------------------

1. Install docker and docker-compose
2. Run './scripts/run-server.sh dev'
3. Frontend will be running on localhost:3000
4. Comment out the loaddata line


Setup For Local Testing
-----------------------

1. Install docker and docker-compose
2. Uncomment loaddata line in entrypoint.dev.sh
3. Run './scripts/run-server.sh dev'
4. API will be running on localhost:8000
5. Frontend will be running on localhost:3000
6. Comment out the loaddata line


Production Deployment
---------------------

Production deployment is currently not supported and you'd need to do any extra legwork to make sure it is secure
and ready for production. Using the development version is NOT RECOMMENDED and would lead to issues. This is in a planned 
release in the roadmap and will get to it once the application is more feature complete and secure.


Pre-Commit
----------

All commits need to be linted according to the standards set out in pre-commit
so we keep a clean and stardardized code look. To run pre-commit manually:

1. Install pre-commit
2. Run 'pre-commit run --all-files'
3. Ensure all checks pass


Testing
-------

For Backend:

1. Run './scripts/run-test.sh'
2. Ensure all tests pass
3. This will generate a .coverage directory where you view the code coverage per file


Test Data
---------

If you used the fixture (by uncommenting out the loaddata command), here are test users to visit the site:

role: superuser (for admin/api site)
- username: dev@dev.com
- password: dev

role: tenant owner with onboarding completed
- username: test@test.com
- password: releasecab

If you did a clean install, you'll need to go through the signup flow to create a new tenant

License
-------

Release CAB is released under GPL-3.0 license.

Support The Project
-------------------

If you wanted to support the project, feel free to create an issue or submit a PR! If you wanted to support the ongoing
development of the project, you can buy me a coffee here: https://www.buymeacoffee.com/releasecab

Major Contributors
------------------

Currently developed and maintained by Lance Parlier. Feel free to reach out so we can collaborate and make this project better!
