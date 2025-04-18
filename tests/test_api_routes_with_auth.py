import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time


def test_login(logged_client):
    try:
        logged_client.get("http://127.0.0.1:5000/profile")
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/profile"
        )
        assert logged_client.current_url == "http://127.0.0.1:5000/profile"

    except Exception as e:
        pytest.fail(f"Failed due to: {e}")


def test_logout(logged_client):
    try:
        logout_element = logged_client.find_element(By.LINK_TEXT, "Logout")
        logout_element.click()

        logged_client.get("http://127.0.0.1:5000/login")

        # Wait for the URL to change or a specific element to appear
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/login"
        )
        login_button = logged_client.find_element(By.CLASS_NAME, 'btn')
        assert login_button.text == "Login"
    except Exception as e:
        pytest.fail(f"Failed due to: {e}")


def test_dijkstra_start_point(logged_client):
    try:
        logged_client.get("http://127.0.0.1:5000/algorithms/dijkstra")
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/algorithms/dijkstra"
        )

        start_point_button = logged_client.find_element(By.ID, "button-startpoint")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });", start_point_button)

        # Wait until the element is clickable
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "button-startpoint")))

        # execute JS code to bypass the UI animations/popups
        logged_client.execute_script("arguments[0].click();", start_point_button)

        grid_cell = logged_client.find_element(By.ID, "grid-10-10")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });",
                                     grid_cell)
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "grid-10-10")))
        # execute JS code to bypass the UI animations/popups

        logged_client.execute_script("arguments[0].click();", grid_cell)

        startpoint_element = logged_client.find_element(By.ID, "startpoint")
        assert startpoint_element

    except Exception as e:
        pytest.fail(f"Failed due to: {e}")


def test_dijkstra_search_point(logged_client):
    try:
        logged_client.get("http://127.0.0.1:5000/algorithms/dijkstra")
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/algorithms/dijkstra"
        )

        search_point_button = logged_client.find_element(By.ID, "button-searchpoint")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });", search_point_button)

        # Wait until the element is clickable
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "button-searchpoint")))

        # execute JS code to bypass the UI animations/popups
        logged_client.execute_script("arguments[0].click();", search_point_button)

        grid_cell = logged_client.find_element(By.ID, "grid-12-33")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });",
                                     grid_cell)
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "grid-12-33")))
        # execute JS code to bypass the UI animations/popups

        logged_client.execute_script("arguments[0].click();", grid_cell)

        search_point_element = logged_client.find_element(By.ID, "eye0")
        assert search_point_element

    except Exception as e:
        pytest.fail(f"Failed due to: {e}")


def test_dijkstra_search_flow(logged_client):
    try:
        logged_client.get("http://127.0.0.1:5000/algorithms/dijkstra")
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/algorithms/dijkstra"
        )

        start_point_button = logged_client.find_element(By.ID, "button-startpoint")
        search_point_button = logged_client.find_element(By.ID, "button-searchpoint")
        visualize_simulation_btn = logged_client.find_element(By.ID, "button-start")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });",
                                     start_point_button)

        # Wait until the element is clickable
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "button-startpoint")))

        # execute JS code to bypass the UI animations/popups
        logged_client.execute_script("arguments[0].click();", start_point_button)

        grid_cell = logged_client.find_element(By.ID, "grid-10-10")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });",
                                     grid_cell)
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "grid-10-10")))
        # execute JS code to bypass the UI animations/popups

        logged_client.execute_script("arguments[0].click();", grid_cell)

        # Wait until the element is clickable
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "button-searchpoint")))

        # execute JS code to bypass the UI animations/popups
        logged_client.execute_script("arguments[0].click();", search_point_button)

        grid_cell = logged_client.find_element(By.ID, "grid-10-33")

        # Scroll into view
        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center' });",
                                     grid_cell)

        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "grid-10-33")))
        # execute JS code to bypass the UI animations/popups

        logged_client.execute_script("arguments[0].click();", grid_cell)

        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "button-start")))
        logged_client.execute_script("arguments[0].click();", visualize_simulation_btn)

        WebDriverWait(logged_client, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "nodeShortestPath")))

        shortest_path_cells = [logged_client.find_element(By.ID, f"grid-10-{i}") for i in range(10, 34)]

        for shortest_path_cell in shortest_path_cells:
            assert shortest_path_cell.get_attribute("class") == "nodeShortestPath"

    except Exception as e:
        pytest.fail(f"Failed due to: {e}")


def test_dijkstra_clear_board(logged_client):
    try:
        logged_client.get("http://127.0.0.1:5000/algorithms/dijkstra")
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/algorithms/dijkstra")

        startpoint_button = logged_client.find_element(By.ID, "button-startpoint")
        search_point_button = logged_client.find_element(By.ID, "button-searchpoint")
        grid_cell_start = logged_client.find_element(By.ID, "grid-10-10")
        grid_cell_end = logged_client.find_element(By.ID, "grid-10-20")
        clear_button = logged_client.find_element(By.ID, "button-clear")

        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto' });", startpoint_button)
        WebDriverWait(logged_client, 10).until(EC.element_to_be_clickable((By.ID, "button-startpoint")))

        logged_client.execute_script("arguments[0].click();", startpoint_button)
        logged_client.execute_script("arguments[0].click();", grid_cell_start)
        logged_client.execute_script("arguments[0].click();", search_point_button)
        logged_client.execute_script("arguments[0].click();", grid_cell_end)

        start_marked_grid_cell = logged_client.find_elements(By.ID, "startpoint")
        end_marked_grid_cell = logged_client.find_elements(By.ID, "eye0")

        assert start_marked_grid_cell and end_marked_grid_cell
        logged_client.execute_script("arguments[0].click();", clear_button)

        start_marked_grid_cell = logged_client.find_elements(By.ID, "startpoint")
        end_marked_grid_cell = logged_client.find_elements(By.ID, "eye0")
        assert not start_marked_grid_cell and not end_marked_grid_cell

    except Exception as e:
        pytest.fail(f"Failed due to: {e}")


def test_dijkstra_create_walls(logged_client):
    try:
        logged_client.get("http://127.0.0.1:5000/algorithms/dijkstra")
        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.current_url == "http://127.0.0.1:5000/algorithms/dijkstra"
        )
        walls_button = logged_client.find_element(By.ID, "button-obstacles")

        logged_client.execute_script("arguments[0].scrollIntoView({ behavior: 'auto' });", walls_button)

        WebDriverWait(logged_client, 10).until(
            EC.element_to_be_clickable((By.ID, "button-obstacles"))
        )

        logged_client.execute_script("arguments[0].click();", walls_button)

        action = ActionChains(logged_client)
        start_cell = WebDriverWait(logged_client, 10).until(
            EC.presence_of_element_located((By.ID, "grid-1-10"))
        )
        # Click and drag
        action.click_and_hold(start_cell)
        for i in range(11, 21):
            cell = logged_client.find_element(By.ID, f"grid-1-{i}")
            action.move_to_element(cell)

        action.release().perform()

        WebDriverWait(logged_client, 10).until(
            lambda driver: driver.find_element(By.ID, "grid-1-20").get_attribute("class") == "node-wall"
        )

        for i in range(11, 21):
            assert logged_client.find_element(By.ID, f"grid-1-{i}").get_attribute("class") == "node-wall"

    except Exception as e:
        pytest.fail(f"Failed due to: {e}")
