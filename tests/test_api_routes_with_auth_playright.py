from asyncio import timeout

import pytest
from tests.playwright_pages import LoginPage, HomePage, PageFactory, PageType
from playwright.sync_api import expect
from logging import info
from tests.locators import URL_SOLVE_PROBLEMS


def test_get_solve_problem_section(playright_logged_client):
    try:
        playright_logged_client.goto(URL_SOLVE_PROBLEMS)
        playright_logged_client.wait_for_url(URL_SOLVE_PROBLEMS, timeout=3000)
        assert playright_logged_client.url == URL_SOLVE_PROBLEMS
    except Exception as e:
        assert False, f"Failed of {e}"


@pytest.mark.timeout(15)
def test_login(playright_browser):
    page = playright_browser.new_page()
    login_page = PageFactory.get_page(PageType.LOGIN, page)
    login_page.login()
    info("Finished login. Checking for redirect to the homepage.")

    home_page = login_page.get_home_page()
    info("Verify profile section on navbar exists.")
    profile_link = home_page.get_profile_link()
    expect(profile_link).to_be_visible()
