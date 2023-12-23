import csv
import os

def generate_url_for_id(id_, start_index):
    base_url = "https://bugs.chromium.org/p/chromium/issues/detail?id={}&q=label%3Aexternal_security_report&can=1&start={}"
    return base_url.format(id_, start_index)

def main():
    project_folder = "/Users/jiachengding/PycharmProjects/google"
    csv_file_path = os.path.join(project_folder, 'ids_unique.csv')

    # 创建 bugreport 文件夹
    bugreport_folder = os.path.join(project_folder, 'bugreport')
    if not os.path.exists(bugreport_folder):
        os.mkdir(bugreport_folder)

    urls = []
    with open(csv_file_path, 'r') as csvfile:
        reader = csv.reader(csvfile)
        for index, row in enumerate(reader):
            id_ = row[0]
            # 创建对应ID的文件夹
            bug_folder = os.path.join(bugreport_folder, id_)
            if not os.path.exists(bug_folder):
                os.mkdir(bug_folder)
            # 计算起始索引，这里假设每100个bug一个新的页面
            start_index = index // 100 * 100
            urls.append(generate_url_for_id(id_, start_index))

    # 写入URL到文件
    urls_file_path = os.path.join(project_folder, 'bugreport/ids_urls.txt')
    with open(urls_file_path, 'w') as f:
        for url in urls:
            f.write(url + '\n')
    print(f"URLs have been written to {urls_file_path}")

if __name__ == '__main__':
    main()
