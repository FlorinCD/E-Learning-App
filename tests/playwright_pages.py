from abc import ABC, abstractmethod
from tests.locators import LOGIN_PAGE_EMAIL_LOCATOR, LOGIN_PAGE_PASSWORD_LOCATOR, LOGIN_PAGE_SUBMIT_LOCATOR, URL_HOME_PAGE, URL_LOGIN_PAGE
from dotenv import load_dotenv
from tests.conftest import EMAIL, PASSWORD
from enum import Enum

load_dotenv()


class PageType(Enum):
    LOGIN = "login"
    HOME = "home"


class BasePage:

    def __init__(self, page):
        self.page = page

    def goto(self, url):
        self.page.goto(url)

    def get_page(self):
        raise NotImplementedError("This page must define its own goto_self_page method.")


class LoginPage(BasePage):

    def __init__(self, page):
        super().__init__(page)
        self.email_input = None
        self.password_input = None
        self.submit_btn = None

    def login(self, email: str=None, password: str=None):
        if email is not None and password is not None:
            self.email_input.fill(email)
            self.password_input.fill(password)
        else:
            self.email_input.fill(EMAIL)
            self.password_input.fill(PASSWORD)
        self.submit_btn.click()

    def goto(self, url: str):
        self.page.goto(url)

    def get_page(self):

        self.page.goto(URL_LOGIN_PAGE)
        self.page.wait_for_url(URL_LOGIN_PAGE, timeout=2000)

        self.email_input = self.page.locator(f'[name={LOGIN_PAGE_EMAIL_LOCATOR}]')
        self.password_input = self.page.locator(f'[name={LOGIN_PAGE_PASSWORD_LOCATOR}]')
        self.submit_btn = self.page.locator(f'[name={LOGIN_PAGE_SUBMIT_LOCATOR}]')

        self.email_input.wait_for(state="visible", timeout=5000)
        self.password_input.wait_for(state="visible", timeout=5000)
        self.submit_btn.wait_for(state="visible", timeout=5000)

        return self.page

    def get_home_page(self):
        home_page = HomePage(self.page)
        home_page.get_page()
        return home_page


class HomePage(BasePage):

    def __init__(self, page):
        super().__init__(page)

    def goto(self, url: str):
        self.page.goto(url)

    def get_page(self):
        self.page.goto(URL_HOME_PAGE)
        self.page.wait_for_url(URL_HOME_PAGE, timeout=2000)

    def get_profile_link(self):
        profile_link = self.page.locator('a.nav-link.active', has_text="Profile")
        return profile_link


class PageFactory:

    @staticmethod
    def get_page(page_type: PageType, page):
        new_page = None
        if page_type.value == "login":
            new_page = LoginPage(page)
        elif page_type.value == "home":
            new_page = HomePage(page)
        new_page.get_page()
        return new_page

