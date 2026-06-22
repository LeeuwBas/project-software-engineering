# python
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

import base64

class UserApiTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.client = APIClient()
        # try named routes, fallback to common paths
        self.users_url = reverse("user-list")
        self.user_detail = lambda pk: reverse("user-detail", args=[pk])
        self.username_field = self.User.USERNAME_FIELD


    def _create_user(self, email="apiuser@example.com"):
        return self.User.objects.create_user(**{self.username_field: email, "password": "Strongpass1!"})


    def test_create_user_without_auth(self):
        payload = {
            "email": "apiuser@example.com",
            "password": "Strongpass1!",
            "settings": 0,
            "username": "API USER",
            "wee": "WOO",
        }
        res = self.client.post(self.users_url, payload, format="json")
        self.assertIn(res.status_code, (status.HTTP_201_CREATED, status.HTTP_200_OK))
        data = res.json() if hasattr(res, "json") else res.data
        # should not leak password
        self.assertNotIn("password", data)
        # user created in db
        self.assertTrue(self.User.objects.filter(**{self.username_field: payload[self.username_field]}).exists())


    def test_user_list_not_exposed(self):
        self.client.force_authenticate(user=self._create_user())
        res = self.client.get(self.users_url, format="json")
        self.assertIn(res.status_code,
                      (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND, status.HTTP_405_METHOD_NOT_ALLOWED))


    def test_detail_access_restricted_to_owner(self):
        u1 = self._create_user(email="u1@example.com")
        u2 = self._create_user(email="u2@example.com")

        # authenticate as u1
        self.client.force_authenticate(user=u1)
        res_self = self.client.get(self.user_detail(u1.pk), format="json")
        self.assertEqual(res_self.status_code, status.HTTP_200_OK)

        res_other = self.client.get(self.user_detail(u2.pk), format="json")
        self.assertIn(res_other.status_code,
                      (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND, status.HTTP_401_UNAUTHORIZED))


class AuthApiTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.client = APIClient()
        self.login_url = reverse("token_obtain_pair")

    def test_login_returns_token_like_field(self):
        creds = {self.User.USERNAME_FIELD: "authuser@example.com", "password": "testpass"}
        self.User.objects.create_user(**creds)
        res = self.client.post(self.login_url, creds, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(all(k in data for k in ("access", "refresh")))

    def test_login_with_invalid_credentials(self):
        creds = {self.User.USERNAME_FIELD: "authuser@example.com", "password": "testpass"}
        self.User.objects.create_user(**creds)
        res = self.client.post(self.login_url, {**creds, "password": "wrongpass"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_invalidation_on_refresh(self):
        # Create a user and log in
        creds = {self.User.USERNAME_FIELD: "authuser@example.com", "password": "testpass"}
        self.User.objects.create_user(**creds)
        res = self.client.post(self.login_url, creds, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()

        refresh_token = data["refresh"]
        access_token = data["access"]

        # Refresh the token
        refresh_url = reverse("token_refresh")
        res_refresh = self.client.post(refresh_url, {"refresh": refresh_token}, format="json")
        self.assertEqual(res_refresh.status_code, status.HTTP_200_OK)
        data_refresh = res_refresh.json()
        self.assertTrue(all(k in data_refresh for k in ("access", "refresh")))
        new_access_token = data_refresh["access"]
        new_refresh_token = data_refresh["refresh"]

        # Old refresh token should now be invalid
        res_old_refresh = self.client.post(refresh_url, {"refresh": refresh_token}, format="json")
        self.assertEqual(res_old_refresh.status_code, status.HTTP_401_UNAUTHORIZED)

        # Old access token should still be valid until it expires
        protected_url = reverse("user-me")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        res_protected = self.client.get(protected_url, format="json")
        self.assertEqual(res_protected.status_code, status.HTTP_200_OK)

        # New access token should be valid
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {new_access_token}")
        res_new_protected = self.client.get(protected_url, format="json")
        self.assertEqual(res_new_protected.status_code, status.HTTP_200_OK)

    def test_token_invalidation_on_new_session(self):
        # Create a user and log in
        creds = {self.User.USERNAME_FIELD: "authuser@example.com", "password": "testpass"}
        self.User.objects.create_user(**creds)
        res = self.client.post(self.login_url, creds, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()

        refresh_token = data["refresh"]
        access_token = data["access"]

        res = self.client.post(self.login_url, creds, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        new_refresh_token = data["refresh"]
        new_access_token = data["access"]

        # New refresh token should be valid
        refresh_url = reverse("token_refresh")
        res_refresh = self.client.post(refresh_url, {"refresh": new_refresh_token}, format="json")
        self.assertEqual(res_refresh.status_code, status.HTTP_200_OK)

        # Old refresh token should be invalid
        res_old_refresh = self.client.post(refresh_url, {"refresh": refresh_token}, format="json")
        self.assertEqual(res_old_refresh.status_code, status.HTTP_401_UNAUTHORIZED)

        # Old access token should be invalid
        protected_url = reverse("user-me")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        res_protected = self.client.get(protected_url, format="json")
        self.assertEqual(res_protected.status_code, status.HTTP_401_UNAUTHORIZED)

        # New access token should be valid
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {new_access_token}")
        res_new_protected = self.client.get(protected_url, format="json")
        self.assertEqual(res_new_protected.status_code, status.HTTP_200_OK)

class SettingsAPITests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.client = APIClient()

        self.user = self.User.objects.create_user(
            username="test1", email="test1@test.com", password="verypassword"
        )

        self.string = "this is a test string"
        self.b64string = base64.b64encode(self.string.encode()).decode()

    def authenticate(self, user):
        self.client.force_authenticate(user)

    def testSet(self):
        self.authenticate(self.user)

        res = self.client.post("/users/settings", {"settings": self.b64string})
        self.user.refresh_from_db()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            self.b64string, self.user.settings
        )

    def testGet(self):
        self.authenticate(self.user)
        self.user.settings = self.b64string
        self.user.save()

        res = self.client.get("/users/settings")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["settings"], self.b64string)

    def testSystem(self):
        self.authenticate(self.user)

        setres = self.client.post("/users/settings", {"settings": self.b64string})
        self.assertEqual(setres.status_code, 200)

        getres = self.client.get("/users/settings")
        self.assertEqual(getres.json()["settings"], self.b64string)
