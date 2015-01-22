"""
Django settings for bak project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'o0pm=1e)6@icnuo7k9s5**76hi+8i5eaqy4v#xf4s1z+se7!lp'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_rq',
    'djsupervisor',

    'task_queue',

    'bak.projects',
    'bak.actions',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'bak.urls'

WSGI_APPLICATION = 'bak.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'etc/db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "bak/static"),
)

BACKUPS_DIR = os.path.join(BASE_DIR, 'backups')

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'bak/templates'),
)


RQ_SHOW_ADMIN_LINK = True
RQ_QUEUES = {
    'default': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
        'DEFAULT_TIMEOUT': 360,
    },
}

SUPERVISOR_CONFIG_FILE = os.path.join(BASE_DIR, 'etc/supervisord.conf')


SUIT_CONFIG = {
    'ADMIN_NAME': 'OIPA',
    'MENU': (
        # Keep original label and models
        'sites',
        {'app': 'auth', 'label': 'Authorization', 'icon':'icon-lock'},
        {'app': 'bak.projects', 'label': 'Projects', 'icon':'icon-lock'},
        # Rename app and set icon
        {'label': 'Task queue', 'url': ( '/queue/'), 'icon':'icon-tasks', 'models': [
            {'label': 'Task overview', 'url': ( '/queue/')},
            {'label': 'Default queue', 'url': ( '/queue/queues/0/')},
            {'label': 'Parse queue', 'url': ( '/queue/queues/1/')},
            {'label': 'Failed tasks', 'url': ( '/queue/queues/2/')},
        ]},
    )
}
