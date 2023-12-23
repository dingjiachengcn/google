from selenium import webdriver
from time import sleep
import os
import re

def get_all_content(driver):
    script = """
        const getAllContent = (elem, seenElements = new WeakSet()) => {
            if (seenElements.has(elem)) return '';
            seenElements.add(elem);
            let content = [];

            // 处理 Shadow DOM
            if (elem.shadowRoot) {
                Array.from(elem.shadowRoot.childNodes).forEach(child => {
                    content.push(getAllContent(child, seenElements));
                });
            }

            // 处理常规 DOM 子节点
            Array.from(elem.childNodes).forEach(child => {
                if (!seenElements.has(child)) {
                    content.push(getAllContent(child, seenElements));
                }
            });

            // 捕获元素的外部 HTML 或文本内容
            if (elem.nodeType === Node.ELEMENT_NODE) {
                content.push(elem.outerHTML);
            } else if (elem.nodeType === Node.TEXT_NODE) {
                content.push(elem.textContent);
            }

            return content.join('\\n\\n');
        };
        return getAllContent(document.documentElement);
    """
    return driver.execute_script(script)

def fetch_and_save_html(driver, url, folder_path, id_):
    driver.get(url)
    sleep(2)  # 等待页面完全加载

    all_content = get_all_content(driver)

    with open(os.path.join(folder_path, f'{id_}_v2all.txt'), 'w', encoding='utf-8') as f:
        f.write(all_content)

def main():
    bugreport_folder = "/Users/jiachengding/PycharmProjects/google/bugreport"
    urls_file_path = "/Users/jiachengding/PycharmProjects/google/ids_urls.txt"

    if not os.path.exists(bugreport_folder):
        os.makedirs(bugreport_folder)

    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--headless')  # 启用无头模式
    # 添加其他必要的选项

    with webdriver.Chrome(options=options) as driver:
        with open(urls_file_path, 'r') as f:
            urls = [url.strip() for url in f.readlines()]

        for url in urls:
            match = re.search(r'id=(\d+)', url)
            if match:
                id_ = match.group(1)
                folder_path_for_id = os.path.join(bugreport_folder, id_)

                if not os.path.exists(folder_path_for_id):
                    os.makedirs(folder_path_for_id)

                fetch_and_save_html(driver, url, folder_path_for_id, id_)
                print(f"Saved content for {id_} in {folder_path_for_id}/{id_}_v2all.txt")

if __name__ == '__main__':
    main()
