# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support import expected_conditions as EC
#
# driver = webdriver.Firefox()
# driver.get('http://localhost:50000/')
#
# WebDriverWait(driver, 1).until(EC.visibility_of_element_located((By.CLASS_NAME, "pricerow")))
#
# html_page = driver.page_source
# driver.quit()
#
# print(http)
# # from bs4 import BeautifulSoup
# # soup = BeautifulSoup(html_page);
# # print(soup)
#
# # elem = driver.find_elements_by_css_selector('tr')
# # elem.click()
# # for a in elem:
# # 	print(a.text)

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
import time

browser = webdriver.Firefox()
browser.get("http://localhost:50000")
time.sleep(1)
delay = 10 # seconds
try:
	elems = browser.find_elements_by_tag_name('tr')
	for e in elems:
		print(e.text)
except TimeoutException:
    print("Loading took too much time!")
