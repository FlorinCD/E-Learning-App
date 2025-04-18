

def test_home_page(chrome_driver_app):
    try:
        chrome_driver_app.get("http://127.0.0.1:5000/home")
    except Exception as e:
        assert False, f'Failed of {e}'

    assert chrome_driver_app.current_url == "http://127.0.0.1:5000/home"


def test_algorithms_page(chrome_driver_app):
    try:
        chrome_driver_app.get("http://127.0.0.1:5000/algorithms")
    except Exception as e:
        assert False, f'Failed of {e}'

    assert chrome_driver_app.current_url == "http://127.0.0.1:5000/algorithms"


def test_data_structures_page(chrome_driver_app):
    try:
        chrome_driver_app.get("http://127.0.0.1:5000/data-structures")
    except Exception as e:
        assert False, f'Failed of {e}'

    assert chrome_driver_app.current_url == "http://127.0.0.1:5000/data-structures"


def test_login_page(chrome_driver_app):
    try:
        chrome_driver_app.get("http://127.0.0.1:5000/login")
    except Exception as e:
        assert False, f'Failed of {e}'

    assert chrome_driver_app.current_url == "http://127.0.0.1:5000/login"

