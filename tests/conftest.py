from website import create_app
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from dotenv import load_dotenv
import pytest
import os

# USER CREDENTIALS FOR TEST
load_dotenv(dotenv_path="C:\\Users\\Florin\\Documents\\E-Learning Project\\website\\.env")

EMAIL = os.getenv("EMAIL_TEST")
PASSWORD = os.getenv("PASSWORD_TEST")

# options for webdriver
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-notifications")
options.add_argument("--incognito")
options.add_argument("--no-default-browser-check")
options.add_argument("--disable-extensions")
options.add_argument("--disable-popup-blocking")
options.add_argument("--disable-translate")
options.add_argument("--disable-infobars")
options.add_argument("--disable-password-manager-reauthentication")
options.add_argument("--disable-save-password-bubble")

# Set up a temp profile so you're not signed into Chrome
options.add_argument("--user-data-dir=/tmp/test-profile")

prefs = {
    "credentials_enable_service": False,
    "profile.password_manager_enabled": False,
    "profile.default_content_setting_values.notifications": 2
}
options.add_experimental_option("prefs", prefs)


@pytest.fixture(scope="module")
def chrome_driver_app():
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()


@pytest.fixture(scope="module")
def logged_client(chrome_driver_app):
    chrome_driver_app.get("http://127.0.0.1:5000/login")
    WebDriverWait(chrome_driver_app, 10).until(
        lambda driver: driver.current_url == "http://127.0.0.1:5000/login"
    )
    email_input = chrome_driver_app.find_element(By.NAME, "login-email")
    password_input = chrome_driver_app.find_element(By.NAME, "login-password")
    login_button = chrome_driver_app.find_element(By.CLASS_NAME, "btn")

    email_input.send_keys(EMAIL)
    password_input.send_keys(PASSWORD)
    login_button.click()
    WebDriverWait(chrome_driver_app, 10).until(
        lambda driver: driver.current_url == "http://127.0.0.1:5000/home"
    )

    yield chrome_driver_app


@pytest.fixture(scope="function")
def app_instance():
    yield create_app()


@pytest.fixture(scope="function")
def local_client(app_instance):
    with app_instance.test_client() as client:
        yield client
