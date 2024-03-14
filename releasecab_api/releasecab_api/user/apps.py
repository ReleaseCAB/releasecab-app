from django.apps import AppConfig


class UserConfig(AppConfig):
    name = 'releasecab_api.user'

    def ready(self):
        import releasecab_api.user.signals  # noqa
