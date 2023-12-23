import pandas as pd

def remove_duplicates_from_csv(file_path):
    try:
        # 读取CSV文件
        df = pd.read_csv(file_path)

        # 去除重复项
        df_unique = df.drop_duplicates()

        # 保存结果到新文件
        output_file_path = file_path.replace('.csv', '_unique.csv')
        df_unique.to_csv(output_file_path, index=False)

        print(f"去重后的文件已保存为：{output_file_path}")
    except Exception as e:
        print(f"处理文件时出错：{e}")

# 使用函数
file_path = '/Users/jiachengding/PycharmProjects/google/ids.csv'
remove_duplicates_from_csv(file_path)
