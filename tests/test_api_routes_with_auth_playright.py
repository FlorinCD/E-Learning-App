import pytest
from tests.conftest import SOLVE_PROBLEMS_URL


def test_get_solve_problem_section(playright_logged_client):
    try:
        playright_logged_client.goto(SOLVE_PROBLEMS_URL)
        playright_logged_client.wait_for_url(SOLVE_PROBLEMS_URL, timeout=3000)
        assert playright_logged_client.url == SOLVE_PROBLEMS_URL
    except Exception as e:
        assert False, f"Failed of {e}"


