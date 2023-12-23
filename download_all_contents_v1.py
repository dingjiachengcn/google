from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import os
import re

def get_all_content(driver, element):
    script = """
        const getAllContent = (elem) => {
            let content = [];

            // 如果元素有 Shadow DOM，递归地遍历其子节点
            if (elem.shadowRoot) {
                elem.shadowRoot.childNodes.forEach(child => {
                    content.push(getAllContent(child));
                });
            }

            // 无论如何，都递归地遍历该元素的常规子节点
            elem.childNodes.forEach(child => {
                content.push(getAllContent(child));
            });

            // 捕获元素的外部HTML或文本内容
            content.push(elem.outerHTML || elem.textContent);

            return content.join('');
        };

        return getAllContent(arguments[0]);
    """
    return driver.execute_script(script, element)

def fetch_and_save_html(url, folder_path, id_):
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--headless')
    options.add_argument(
        'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

    with webdriver.Chrome(options=options) as driver:
        driver.get(url)
        sleep()  # 让页面完全加载

        all_elements = driver.find_elements(By.XPATH, "//*")
        contents = []

        for element in all_elements:
            try:
                content = get_all_content(driver, element)
                if content:
                    contents.append(content)
            except Exception as e:
                print(f"Error fetching content for element: {e}")

        # 整合所有内容
        all_content = "\n\n".join(contents)

        with open(os.path.join(folder_path, f'{id_}_all.txt'), 'w', encoding='utf-8') as f:
            f.write(all_content)

def extract_id_from_url(url):
    # 从URL中提取ID
    match = re.search(r'id=(\d+)', url)
    return match.group(1) if match else None

def main():
    urls_file_path = "/Users/jiachengding/PycharmProjects/google/ids_urls.txt"
    bugreport_folder = "/Users/jiachengding/PycharmProjects/google/bugreport"

    if not os.path.exists(bugreport_folder):
        os.makedirs(bugreport_folder)

    with open(urls_file_path, 'r') as f:
        for url in f:
            url = url.strip()
            id_ = extract_id_from_url(url)
            if not id_:
                print(f"Could not extract ID from URL: {url}")
                continue

            folder_path_for_id = os.path.join(bugreport_folder, id_)

            if not os.path.exists(folder_path_for_id):
                os.makedirs(folder_path_for_id)

            fetch_and_save_html(url, folder_path_for_id, id_)
            print(f"Saved content for {id_} in {folder_path_for_id}/{id_}_all.txt")

if __name__ == '__main__':
    main()