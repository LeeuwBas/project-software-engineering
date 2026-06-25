import uuid

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.mail import send_mail
from django.db import models


class UserManager(BaseUserManager):
    """
    A user manager that allows users to be created.
    """
    use_in_migrations = True

    def create_user(self, email, password, **extra_fields):
        """
        Create a new user
        :return: the created user.
        """
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create a superuser. This is a django user, but they have no special permissions in out environment.
        :return: The created user.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

    create_superuser.alters_data = True
    create_user.alters_data = True


class User(AbstractUser):
    """
    A custom user model, that has all required fields we need for our custom user model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    username = models.CharField(
        "username",
        max_length=150,
        unique=False,
        help_text="Required. 150 characters or fewer.",
        validators=[],
    )
    email = models.EmailField("email address", unique=True)
    first_name = None
    last_name = None

    settings = models.TextField(default="")
    token_id = models.IntegerField(default=0)
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)
